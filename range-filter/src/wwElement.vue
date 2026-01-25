<template>
  <div class="range-filter-container" :class="{ 'is-open': isOpen }">
    <!-- Trigger Button -->
    <button
      ref="triggerButton"
      class="range-filter-trigger"
      :class="{ 'has-value': hasValue }"
      @click="toggleDropdown"
    >
      <span class="trigger-label">{{ displayLabel }}</span>
      <div class="trigger-indicators">
        <span v-if="hasValue" class="selected-value">
          {{ displayRangeValue }}
        </span>
        <button
          v-if="hasValue"
          class="clear-button"
          @click.stop="clearSelection"
          aria-label="Clear selection"
        >
          <span class="clear-icon">×</span>
        </button>
        <svg 
          v-else
          class="chevron-icon"
          :class="{ 'is-open': isOpen }"
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M2.5 4.5L6 8L9.5 4.5" 
            stroke="currentColor" 
            stroke-width="1.5" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </button>

    <!-- Dropdown -->
    <div 
      v-if="isOpen" 
      class="dropdown-container"
      :class="{
        'align-right': alignRight,
        'open-upward': openUpward
      }"
    >
      <div class="range-content">
        <!-- From Input -->
        <div class="range-field">
          <label class="range-label">{{ fromLabel }}</label>
          <template v-if="content.type === 'date'">
            <input
              ref="fromInput"
              type="date"
              class="range-input"
              :value="fromDateValue"
              :max="toValue || content.toMaxValue"
              @input="onFromChange($event.target.value)"
            />
          </template>
          <template v-else>
            <input
              ref="fromInput"
              type="number"
              class="range-input"
              :value="fromValue"
              :min="content.fromMinValue"
              :max="toValue || content.toMaxValue"
              :placeholder="fromLabel"
              @input="onFromChange($event.target.value)"
            />
          </template>
        </div>

        <!-- Separator -->
        <div class="range-separator">
          <span>{{ separatorText }}</span>
        </div>

        <!-- To Input -->
        <div class="range-field">
          <label class="range-label">{{ toLabel }}</label>
          <template v-if="content.type === 'date'">
            <input
              ref="toInput"
              type="date"
              class="range-input"
              :value="toDateValue"
              :min="fromValue || content.fromMinValue"
              @input="onToChange($event.target.value)"
            />
          </template>
          <template v-else>
            <input
              ref="toInput"
              type="number"
              class="range-input"
              :value="toValue"
              :min="fromValue || content.fromMinValue"
              :max="content.toMaxValue"
              :placeholder="toLabel"
              @input="onToChange($event.target.value)"
            />
          </template>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="dropdown-footer">
        <button class="apply-button" @click="applyFilter">
          {{ applyButtonText }}
        </button>
        <button v-if="hasValue" class="clear-all-button" @click="clearSelection">
          {{ clearButtonText }}
        </button>
      </div>
    </div>

    <!-- Overlay for outside clicks -->
    <div v-if="isOpen" class="dropdown-overlay" @click="closeDropdown"></div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { isEqual } from 'lodash';

export default {
  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    // Editor state
    const isEditing = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState?.isEditing;
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    });

    // Component state
    const isOpen = ref(false);
    const triggerButton = ref(null);
    const fromInput = ref(null);
    const toInput = ref(null);
    const alignRight = ref(false);
    const openUpward = ref(false);
    let changeDebounceTimer = null;

    // Internal value management
    const { value: internalValue, setValue: setInternalValue } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'value',
      type: 'object',
      defaultValue: computed(() => ({ 
        from: props.content?.initialFromValue ?? null, 
        to: props.content?.initialToValue ?? null 
      }))
    });

    // Local state for inputs
    const fromValue = ref(null);
    const toValue = ref(null);

    // Watch for changes in initial values
    watch(
      () => [props.content?.initialFromValue, props.content?.initialToValue],
      ([newFrom, newTo]) => {
        if (newFrom !== undefined) {
          fromValue.value = newFrom;
        }
        if (newTo !== undefined) {
          toValue.value = newTo;
        }
        // Sync internal value
        const newValue = { from: fromValue.value, to: toValue.value };
        if (!isEqual(newValue, internalValue.value)) {
          setInternalValue(newValue);
          
          // Emit initValueChange event
          emit('trigger-event', {
            name: 'initValueChange',
            event: { value: newValue }
          });
        }
      },
      { immediate: true, deep: true }
    );

    // Computed properties
    const fromLabel = computed(() => {
      if (props.content?.fromLabel) return props.content.fromLabel;
      return props.content?.type === 'date' ? '開始日' : '開始値';
    });

    const toLabel = computed(() => {
      if (props.content?.toLabel) return props.content.toLabel;
      return props.content?.type === 'date' ? '終了日' : '終了値';
    });

    const displayLabel = computed(() => {
      return props.content?.label || 'Range';
    });

    const hasValue = computed(() => {
      return fromValue.value !== null || toValue.value !== null;
    });

    const separatorText = computed(() => {
      return props.content?.separatorText || '〜';
    });

    const applyButtonText = computed(() => {
      return props.content?.applyButtonText || '適用';
    });

    const clearButtonText = computed(() => {
      return props.content?.clearButtonText || 'クリア';
    });

    const displayRangeValue = computed(() => {
      const from = fromValue.value;
      const to = toValue.value;
      const separator = separatorText.value;

      if (from !== null && to !== null) {
        if (props.content?.type === 'date') {
          return `${formatDate(from)} ${separator} ${formatDate(to)}`;
        }
        return `${from} ${separator} ${to}`;
      } else if (from !== null) {
        if (props.content?.type === 'date') {
          return `${formatDate(from)} ${separator}`;
        }
        return `${from} ${separator}`;
      } else if (to !== null) {
        if (props.content?.type === 'date') {
          return `${separator} ${formatDate(to)}`;
        }
        return `${separator} ${to}`;
      }
      return '';
    });

    const fromDateValue = computed(() => {
      if (!fromValue.value) return '';
      // Convert to YYYY-MM-DD format for date input
      if (typeof fromValue.value === 'string') {
        return fromValue.value.substring(0, 10);
      }
      return fromValue.value;
    });

    const toDateValue = computed(() => {
      if (!toValue.value) return '';
      // Convert to YYYY-MM-DD format for date input
      if (typeof toValue.value === 'string') {
        return toValue.value.substring(0, 10);
      }
      return toValue.value;
    });

    // Methods
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        const locale = props.content?.dateLocale || 'en-US';
        const options = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        };
        return date.toLocaleDateString(locale, options);
      } catch (e) {
        return dateStr;
      }
    };

    const onFromChange = (value) => {
      if (isEditing.value) return;

      let newValue = value;
      if (props.content?.type === 'number') {
        newValue = value === '' ? null : Number(value);
      } else {
        newValue = value === '' ? null : value;
      }

      // Validate: from should not exceed to
      if (newValue !== null && toValue.value !== null) {
        if (props.content?.type === 'date') {
          if (new Date(newValue) > new Date(toValue.value)) {
            return; // Don't update if from > to
          }
        } else {
          if (newValue > toValue.value) {
            return; // Don't update if from > to
          }
        }
      }

      fromValue.value = newValue;
      updateInternalValue();
    };

    const onToChange = (value) => {
      if (isEditing.value) return;

      let newValue = value;
      if (props.content?.type === 'number') {
        newValue = value === '' ? null : Number(value);
      } else {
        newValue = value === '' ? null : value;
      }

      // Validate: to should not be less than from
      if (newValue !== null && fromValue.value !== null) {
        if (props.content?.type === 'date') {
          if (new Date(newValue) < new Date(fromValue.value)) {
            return; // Don't update if to < from
          }
        } else {
          if (newValue < fromValue.value) {
            return; // Don't update if to < from
          }
        }
      }

      toValue.value = newValue;
      updateInternalValue();
    };

    const updateInternalValue = () => {
      const newValue = {
        from: fromValue.value,
        to: toValue.value
      };

      setInternalValue(newValue);

      // Clear existing debounce timer
      if (changeDebounceTimer) {
        clearTimeout(changeDebounceTimer);
      }

      // Get debounce delay from content or use default (500ms)
      const debounceDelay = props.content?.debounceChange ?? 500;

      // Set new debounce timer to emit change event
      changeDebounceTimer = setTimeout(() => {
        emit('trigger-event', {
          name: 'change',
          event: { value: newValue }
        });
      }, debounceDelay);
    };

    const applyFilter = () => {
      if (isEditing.value) return;
      
      emit('trigger-event', {
        name: 'apply',
        event: {
          value: {
            from: fromValue.value,
            to: toValue.value
          }
        }
      });
      closeDropdown();
    };

    const clearSelection = (event) => {
      if (event) event.stopPropagation();
      if (isEditing.value) return;

      fromValue.value = null;
      toValue.value = null;

      setInternalValue({ from: null, to: null });

      emit('trigger-event', {
        name: 'change',
        event: { value: { from: null, to: null } }
      });

      emit('trigger-event', {
        name: 'clear',
        event: {}
      });
    };

    const resetToInitial = () => {
      if (isEditing.value) return;

      fromValue.value = props.content?.initialFromValue ?? null;
      toValue.value = props.content?.initialToValue ?? null;

      const newValue = { from: fromValue.value, to: toValue.value };
      setInternalValue(newValue);

      emit('trigger-event', {
        name: 'change',
        event: { value: newValue }
      });
    };

    const toggleDropdown = () => {
      if (isEditing.value) return;

      if (isOpen.value) {
        closeDropdown();
      } else {
        openDropdown();
      }
    };

    const calculateDropdownPosition = () => {
      if (!triggerButton.value) return;

      const doc = wwLib.getFrontDocument();
      const win = wwLib.getFrontWindow();
      
      const buttonRect = triggerButton.value.getBoundingClientRect();
      const viewportWidth = win.innerWidth;
      const viewportHeight = win.innerHeight;
      const dropdownMinWidth = 280;
      const dropdownEstimatedHeight = 200;

      const spaceRight = viewportWidth - buttonRect.right;
      const spaceLeft = buttonRect.left;

      if (spaceRight < dropdownMinWidth && spaceLeft > spaceRight) {
        alignRight.value = true;
      } else {
        alignRight.value = false;
      }

      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      if (spaceBelow < dropdownEstimatedHeight && spaceAbove > spaceBelow) {
        openUpward.value = true;
      } else {
        openUpward.value = false;
      }
    };

    const openDropdown = () => {
      if (isEditing.value) return;

      isOpen.value = true;

      nextTick(() => {
        calculateDropdownPosition();
        if (fromInput.value) {
          fromInput.value.focus();
        }
      });

      emit('trigger-event', {
        name: 'open',
        event: {}
      });
    };

    const closeDropdown = () => {
      if (isEditing.value) return;

      isOpen.value = false;

      emit('trigger-event', {
        name: 'close',
        event: {}
      });
    };

    // Handle click outside
    const handleClickOutside = (event) => {
      if (isOpen.value && 
          triggerButton.value && 
          !triggerButton.value.contains(event.target) &&
          !event.target.closest('.dropdown-container')) {
        closeDropdown();
      }
    };

    // Handle escape key
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen.value) {
        closeDropdown();
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      const doc = wwLib.getFrontDocument();
      doc.addEventListener('mousedown', handleClickOutside);
      doc.addEventListener('keydown', handleKeyDown);
    });

    onBeforeUnmount(() => {
      const doc = wwLib.getFrontDocument();
      doc.removeEventListener('mousedown', handleClickOutside);
      doc.removeEventListener('keydown', handleKeyDown);

      // Clear debounce timer on unmount
      if (changeDebounceTimer) {
        clearTimeout(changeDebounceTimer);
      }
    });

    return {
      isEditing,
      isOpen,
      triggerButton,
      fromInput,
      toInput,
      alignRight,
      openUpward,
      fromValue,
      toValue,
      fromDateValue,
      toDateValue,
      fromLabel,
      toLabel,
      displayLabel,
      hasValue,
      displayRangeValue,
      separatorText,
      applyButtonText,
      clearButtonText,
      onFromChange,
      onToChange,
      applyFilter,
      clearSelection,
      resetToInitial,
      toggleDropdown,
      openDropdown,
      closeDropdown
    };
  }
};
</script>

<style lang="scss" scoped>
.range-filter-container {
  position: relative;
  display: inline-block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  .range-filter-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background-color: white;
    border: 1px solid #D1D5DB;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;

    &:hover {
      border-color: #9CA3AF;
    }

    &:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
    }

    &.has-value {
      background-color: #EFF6FF;
      border-color: #93C5FD;
      color: #1D4ED8;
    }

    .trigger-label {
      margin-right: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .trigger-indicators {
      display: flex;
      align-items: center;
      margin-left: auto;

      .selected-value {
        padding: 2px 6px;
        margin-right: 4px;
        background-color: #DBEAFE;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
      }

      .clear-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        padding: 0;
        margin-left: 4px;
        background: none;
        border: none;
        border-radius: 50%;
        cursor: pointer;

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .clear-icon {
          font-size: 14px;
          line-height: 1;
        }
      }

      .chevron-icon {
        margin-left: 4px;
        color: #6B7280;
        transition: transform 0.2s ease;

        &.is-open {
          transform: rotate(180deg);
        }
      }
    }
  }

  .dropdown-container {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 50;
    min-width: 280px;
    background-color: white;
    border: 1px solid #D1D5DB;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    overflow: hidden;

    &.align-right {
      left: auto;
      right: 0;
    }

    &.open-upward {
      top: auto;
      bottom: calc(100% + 4px);
    }
  }

  .range-content {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 16px;
  }

  .range-field {
    flex: 1;

    .range-label {
      display: block;
      margin-bottom: 4px;
      font-size: 12px;
      font-weight: 500;
      color: #4B5563;
    }

    .range-input {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      font-size: 14px;

      &:focus {
        outline: none;
        border-color: #3B82F6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
      }

      &::placeholder {
        color: #9CA3AF;
      }
    }
  }

  .range-separator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 8px;
    color: #6B7280;
    font-size: 14px;
  }

  .dropdown-footer {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid #E5E7EB;

    .apply-button {
      flex: 1;
      padding: 8px 16px;
      background-color: #3B82F6;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: white;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #2563EB;
      }
    }

    .clear-all-button {
      padding: 8px 16px;
      background: none;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #4B5563;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: #F9FAFB;
        border-color: #9CA3AF;
      }
    }
  }

  .dropdown-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 40;
  }
}
</style>