<template>
  <div class="grouped-table-wrapper" :style="rootStyle">
    <!-- Header Section -->
    <div v-if="content?.showHeader" class="table-header">
      <div class="table-title" v-if="content?.title">
        {{ content?.title }}
      </div>
      <div class="controls">
        <button 
          @click="expandAll" 
          class="btn btn-expand"
          :style="{ backgroundColor: content?.expandButtonColor }"
          v-if="!isEditing"
        >
          {{ content?.expandButtonText }}
        </button>
        <button 
          @click="collapseAll" 
          class="btn btn-collapse"
          :style="{ backgroundColor: content?.collapseButtonColor }"
          v-if="!isEditing"
        >
          {{ content?.collapseButtonText }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="grouped-table">
        <!-- Column widths definition -->
        <colgroup>
          <col 
            v-if="showGroupColumn" 
            :style="{ width: content?.groupColumnWidth || '150px' }" 
          />
          <col 
            v-for="column in displayColumns" 
            :key="`col-${column.key}`"
            :style="{ width: column.width || 'auto' }" 
          />
        </colgroup>

        <thead v-if="content?.showTableHeader">
          <tr>
            <th 
              v-if="showGroupColumn"
              :style="getHeaderStyle()"
            >
              {{ content?.groupColumnLabel || '' }}
            </th>
            <th 
              v-for="column in displayColumns" 
              :key="column.key"
              :style="getHeaderStyle()"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(records, groupKey, groupIndex) in groupedData" :key="groupKey">
            <!-- Group Section Wrapper with gap -->
            <tr 
              v-if="groupIndex > 0" 
              class="group-spacer"
            >
              <td :colspan="totalColumnCount" class="spacer-cell"></td>
            </tr>

            <!-- Group Header Row (always visible, clickable to toggle) -->
            <tr 
              class="group-header"
              :class="{ 'is-expanded': expandedGroups.has(groupKey) }"
              @click="toggleGroup(groupKey)"
              :style="getGroupHeaderStyle()"
            >
              <td :colspan="totalColumnCount" class="group-header-cell">
                <div class="group-header-content">
                  <svg 
                    class="chevron-icon"
                    :class="{ 'chevron-rotated': expandedGroups.has(groupKey) }"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  <span class="group-label">{{ formatGroupKey(groupKey) }}</span>
                  <span 
                    class="group-count"
                    :style="{ backgroundColor: content?.countBadgeColor }"
                  >
                    {{ records.length }}
                  </span>
                  <span class="expand-hint" v-if="content?.showExpandHint">
                    {{ expandedGroups.has(groupKey) ? content?.collapseHintText : content?.expandHintText }}
                  </span>
                </div>
              </td>
            </tr>

            <!-- Expanded State: Data Rows -->
            <tr 
              v-for="(record, idx) in records" 
              v-show="expandedGroups.has(groupKey)"
              :key="getRecordKey(record, idx)"
              class="data-row"
              :class="{ 
                'first-in-group': idx === 0,
                'last-in-group': idx === records.length - 1
              }"
              :style="getDataRowStyle()"
              @click="onRowClick(record)"
            >
              <!-- Data cells -->
              <td 
                v-for="(column, colIdx) in allDisplayColumns" 
                :key="column.key"
                :style="colIdx === 0 && showGroupColumn ? getGroupCellStyle() : getCellStyle()"
                :class="colIdx === 0 && showGroupColumn ? 'group-value-cell' : 'data-cell'"
                :data-label="column.label"
              >
                <!-- First column is empty (just for alignment) since group info is in header -->
                <template v-if="colIdx === 0 && showGroupColumn">
                </template>
                <!-- Regular data columns -->
                <template v-else>
                  <!-- Dropzone for custom content (mapped by column index) -->
                  <wwLayout 
                    v-if="column.useDropzone"
                    :path="`dropzone_custom_${column.dropzoneIndex}`"
                    class="dropzone-container"
                  >
                    <template #default="{ item }">
                      <wwElement
                        v-bind="item"
                        :ww-local-var-record="record"
                        :ww-local-var-index="idx"
                      />
                    </template>
                  </wwLayout>
                  <!-- Default text content -->
                  <template v-else>
                    {{ getNestedValue(record, column.key) }}
                  </template>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';

export default {
  props: {
    content: {
      type: Object,
      required: true
    },
    uid: {
      type: String,
      required: true
    },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    // Editor state
    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState.isEditing;
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    });

    // Internal state
    const expandedGroups = ref(new Set());
    
    // Internal variable for selected row
    const { value: selectedRow, setValue: setSelectedRow } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'selectedRow',
      type: 'object',
      defaultValue: null
    });

    // Computed properties
    const rootStyle = computed(() => ({
      width: '100%',
      fontFamily: props.content?.fontFamily || 'inherit'
    }));

    const parsedColumns = computed(() => {
      try {
        return typeof props.content?.columns === 'string' 
          ? JSON.parse(props.content?.columns) 
          : props.content?.columns || [];
      } catch (e) {
        console.error('Invalid columns format:', e);
        return [];
      }
    });

    // Display columns excludes the groupBy field if configured
    const displayColumns = computed(() => {
      const groupByField = props.content?.groupByField;
      if (!groupByField || !props.content?.excludeGroupColumn) {
        return parsedColumns.value;
      }
      return parsedColumns.value.filter(col => col.key !== groupByField);
    });

    // All display columns including placeholder for group column
    // Each column gets a dropzoneIndex for mapping to custom_1 through custom_20
    const allDisplayColumns = computed(() => {
      let dropzoneCounter = 1;
      const columnsWithIndex = displayColumns.value.map(col => ({
        ...col,
        dropzoneIndex: col.useDropzone ? dropzoneCounter++ : null
      }));
      
      if (showGroupColumn.value) {
        return [{ key: '__group__', label: '', dropzoneIndex: null }, ...columnsWithIndex];
      }
      return columnsWithIndex;
    });

    // Whether to show the dedicated group column
    const showGroupColumn = computed(() => {
      return !!props.content?.groupByField;
    });

    // Total column count for colspan calculations
    const totalColumnCount = computed(() => {
      return displayColumns.value.length + (showGroupColumn.value ? 1 : 0);
    });

    const parsedData = computed(() => {
      try {
        return typeof props.content?.data === 'string' 
          ? JSON.parse(props.content?.data) 
          : props.content?.data || [];
      } catch (e) {
        console.error('Invalid data format:', e);
        return [];
      }
    });

    const groupedData = computed(() => {
  const groups = {};
  const groupByField = props.content?.groupByField;

  if (!groupByField) return { 'すべてのレコード': parsedData.value };

  // First, collect all records into groups
  parsedData.value.forEach(record => {
    const key = getGroupKey(record, groupByField);
    if (!groups[key]) {
      groups[key] = {
        records: [],
        originalValue: getNestedValue(record, groupByField) // Store original value for sorting
      };
    }
    groups[key].records.push(record);
  });

  // Sort the groups by their original date values
  const sortedGroups = {};
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    const valueA = groups[a].originalValue;
    const valueB = groups[b].originalValue;
    
    // Try to parse as dates
    const dateA = new Date(valueA);
    const dateB = new Date(valueB);
    
    // If both are valid dates, sort chronologically (descending - newest first)
    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
      return dateA - dateB;
    }
    
    // Otherwise, sort as strings
    return String(valueB).localeCompare(String(valueA));
  });

  // Build the sorted groups object
  sortedKeys.forEach(key => {
    sortedGroups[key] = groups[key].records;
  });

  return sortedGroups;
});

    // Methods
    const getNestedValue = (obj, path) => {
      if (!obj || !path) return '';
      return path.split('.').reduce((acc, part) => acc?.[part], obj) || '';
    };

    const getGroupKey = (record, groupByField) => {
      const value = getNestedValue(record, groupByField);

      // If it's a date field and formatGroupDates is enabled
      if (props.content?.formatGroupDates && value) {
        let options = { year: 'numeric', month: 'long', day: 'numeric' };

        // Determine formatting options based on string format
        if (typeof value === 'string') {
          // YYYY format
          if (/^\d{4}$/.test(value)) {
            options = { year: 'numeric' };
          }
          // YYYY-MM format
          else if (/^\d{4}-\d{2}$/.test(value)) {
            options = { year: 'numeric', month: 'long' };
          }
        }

        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString(props.content?.dateLocale || 'ja-JP', options);
          }
        } catch (e) {
          // Not a date, return as is
        }
      }

      return value?.toString() || '不明';
    };

    const formatGroupKey = (key) => {
      return props.content?.groupPrefix ? `${props.content.groupPrefix} ${key}` : key;
    };

    const getRecordKey = (record, index) => {
      return record[props.content?.recordKey || 'id'] ?? index;
    };

    const toggleGroup = (groupKey) => {
      if (isEditing.value) return;
      
      if (expandedGroups.value.has(groupKey)) {
        expandedGroups.value.delete(groupKey);
      } else {
        expandedGroups.value.add(groupKey);
      }
      
      // Force reactivity update
      expandedGroups.value = new Set(expandedGroups.value);
      
      // Emit group toggle event
      emit('trigger-event', { 
        name: 'groupToggle', 
        event: { 
          groupKey,
          isExpanded: expandedGroups.value.has(groupKey)
        } 
      });
    };

    const expandAll = () => {
      if (isEditing.value) return;
      
      expandedGroups.value = new Set(Object.keys(groupedData.value));
      
      // Emit event for workflows
      emit('trigger-event', { name: 'expandAll' });
    };

    const collapseAll = () => {
      if (isEditing.value) return;
      
      expandedGroups.value = new Set();
      
      // Emit event for workflows
      emit('trigger-event', { name: 'collapseAll' });
    };

    const onRowClick = (record) => {
      if (isEditing.value) return;
      
      setSelectedRow(record);
      
      // Emit row click event
      emit('trigger-event', { 
        name: 'rowClick', 
        event: { value: record } 
      });
    };

    const getHeaderStyle = () => ({
      backgroundColor: props.content?.headerBackgroundColor,
      color: props.content?.headerTextColor,
      fontSize: props.content?.headerFontSize || '12px',
      padding: props.content?.headerPadding || '12px 24px'
    });

    const getGroupHeaderStyle = () => ({
      backgroundColor: props.content?.groupHeaderBackgroundColor,
      color: props.content?.groupHeaderTextColor
    });

    const getGroupCellStyle = () => ({
      backgroundColor: props.content?.groupHeaderBackgroundColor,
      color: props.content?.groupHeaderTextColor,
      verticalAlign: 'middle'
    });

    const getDataRowStyle = () => ({
      backgroundColor: props.content?.rowBackgroundColor
    });

    const getCellStyle = () => ({
      color: props.content?.cellTextColor,
      fontSize: props.content?.cellFontSize || '14px',
      padding: props.content?.cellPadding || '16px 24px'
    });

    // Initialize with default expanded state
    onMounted(() => {
      if (props.content?.defaultExpanded) {
        expandAll();
      }
    });

    // Watch for changes to defaultExpanded
    watch(() => props.content?.defaultExpanded, (newVal) => {
      if (newVal) {
        expandAll();
      } else {
        collapseAll();
      }
    });

    return {
      isEditing,
      expandedGroups,
      selectedRow,
      rootStyle,
      parsedColumns,
      displayColumns,
      allDisplayColumns,
      showGroupColumn,
      totalColumnCount,
      parsedData,
      groupedData,
      getNestedValue,
      getGroupKey,
      formatGroupKey,
      getRecordKey,
      toggleGroup,
      expandAll,
      collapseAll,
      onRowClick,
      getHeaderStyle,
      getGroupHeaderStyle,
      getGroupCellStyle,
      getDataRowStyle,
      getCellStyle
    };
  }
};
</script>

<style scoped>
/* Remove all focus outlines */
*:focus,
*:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

.grouped-table-wrapper {
  width: 100%;
  padding: 1.5rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.table-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
}

.controls {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.table-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.grouped-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

thead {
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

th {
  text-align: left;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Section gap spacer */
.group-spacer {
  height: 4px;
  background: transparent;
}

.spacer-cell {
  padding: 0;
  height: 4px;
  background: #f3f4f6;
}

/* Group header row (always visible) */
.group-header {
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #93c5fd;
}

.group-header:hover {
  filter: brightness(0.95);
}

.group-header-cell {
  padding: 0;
}

.group-header-content {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  gap: 0.5rem;
}

/* Chevron icon with rotation animation */
.chevron-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  stroke-width: 2;
  transition: transform 0.3s ease-in-out;
  transform: rotate(0deg);
}

/* Rotated state for expanded */
.chevron-icon.chevron-rotated {
  transform: rotate(90deg);
}

.group-label {
  font-weight: 600;
}

.group-count {
  padding: 0.25rem 0.5rem;
  color: white;
  font-size: 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
}

.expand-hint {
  margin-left: auto;
  font-size: 0.875rem;
  opacity: 0.7;
}

/* Group value cell in data rows */
.group-value-cell {
  vertical-align: middle;
  padding: 0.75rem 1.5rem;
  border-right: 2px solid #93c5fd;
}



/* Data rows */
.data-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.data-row:hover {
  filter: brightness(0.98);
}

.data-row.first-in-group {
  border-top: none;
}

.data-row.last-in-group {
  border-bottom: 2px solid #d1d5db;
}

.data-cell {
  vertical-align: middle;
}


.dropzone-container {
  min-height: 24px;
  width: 100%;
}

/* Responsive Card Layout for Mobile/Tablet */
@media (max-width: 768px) {
  .grouped-table, tbody, tr, td {
    display: block;
    width: 100%;
  }

  /* Hide table header */
  thead {
    display: none;
  }

  /* Group Header */
  .group-header {
    margin-top: 1rem;
    border-radius: 0.5rem 0.5rem 0 0;
    border: 1px solid #e5e7eb;
    border-bottom: none;
  }

  /* Data Rows as Cards */
  .data-row {
    background: white;
    border: 1px solid #e5e7eb;
    border-top: none;
    padding: 1rem;
    margin-bottom: 0;
  }

  .data-row:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  /* Cells in Card View */
  .data-cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    text-align: right;
    border-bottom: 1px solid #f3f4f6;
  }

  .data-cell:last-child {
    border-bottom: none;
  }

  /* Label for each cell */
  .data-cell::before {
    content: attr(data-label);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: #6b7280;
    margin-right: 1rem;
    text-align: left;
  }

  /* Hide the empty group value cell in data rows */
  .group-value-cell {
    display: none;
  }

  /* Adjust dropzone container in card view */
  .dropzone-container {
    width: auto;
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
