<template>
  <div class="combobox-container" :class="{ 'is-open': isOpen }">
    <!-- Trigger Button -->
    <button
      ref="triggerButton"
      class="combobox-trigger"
      :class="{
        'has-value': hasValue,
        'multi-select': content.multiSelect
      }"
      @click="toggleDropdown"
    >
      <span class="trigger-label">{{ displayLabel }}</span>
      <div class="trigger-indicators">
        <span v-if="hasValue && content.multiSelect && selectedCount > 0" class="selection-count">
          {{ selectedCount }}件選択
        </span>
        <span v-else-if="hasValue && !content.multiSelect && displayValue" class="selected-value">
          {{ displayValue }}
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
      <!-- Search Bar -->
      <div v-if="!content.hideSearchBar" class="search-container">
        <svg 
          class="search-icon" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input
          ref="searchInput"
          type="text"
          v-model="searchQuery"
          class="search-input"
          placeholder="検索..."
          @input="onSearchInput"
        />
      </div>

      <!-- Options List -->
      <div 
        ref="optionsList"
        class="options-list"
        @scroll="handleScroll"
      >
        <div v-if="content.isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">読み込み中...</p>
        </div>
        <template v-else>
          <button
            v-for="(option, index) in filteredOptions"
            :key="index"
            class="option-item"
            :class="{ 'is-selected': isOptionSelected(option) }"
            @click="selectOption(option)"
          >
            <div class="option-content">
              <span v-if="content.iconKey && option.icon" class="option-icon" v-html="getIconHtml(option)"></span>
              <span class="option-label">{{ getOptionLabel(option) }}</span>
            </div>
            <span v-if="isOptionSelected(option)" class="check-icon">✓</span>
          </button>
          <div v-if="filteredOptions.length === 0 && !content.isLoading" class="no-results">
            結果が見つかりません
          </div>
          <div v-if="content.isLoadingMore" class="loading-more-container">
            <div class="loading-spinner small"></div>
            <p class="loading-text">さらに読み込み中...</p>
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div v-if="hasValue" class="dropdown-footer">
        <div v-if="content.multiSelect && selectedCount > 0" class="selection-summary">
          <p class="selection-text">{{ selectedCount }}件選択中</p>
        </div>
        <button class="clear-all-button" @click="clearSelection">
          クリア
        </button>
      </div>
    </div>

    <!-- Overlay for outside clicks -->
    <div v-if="isOpen" class="dropdown-overlay" @click="closeDropdown"></div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { get, isEqual } from 'lodash';

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
    const searchQuery = ref('');
    const triggerButton = ref(null);
    const searchInput = ref(null);
    const optionsList = ref(null);
    const alignRight = ref(false);
    const openUpward = ref(false);
    let searchDebounceTimer = null;

    // Internal value management
    const { value: internalValue, setValue: setInternalValue } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'value',
      type: 'any',
      defaultValue: props.content?.multiSelect ? [] : null
    });

    // Watch for changes in initialValue with deep tracking for arrays
    watch(
      () => props.content?.initialValue, 
      (newValue, oldValue) => {
        // For multi-select mode, handle arrays specially
        if (props.content?.multiSelect) {
          const newArray = Array.isArray(newValue) ? [...newValue] : [];
          const currentArray = Array.isArray(internalValue.value) ? internalValue.value : [];
          
          // Always update if content differs
          // This ensures even mutations to the same array reference are detected
          if (!isEqual(newArray, currentArray)) {
            setInternalValue(newArray);
          }
        } else {
          // For single-select, only update if value is different
          if (!isEqual(newValue, internalValue.value)) {
            setInternalValue(newValue);
          }
        }
      },
      { deep: true, immediate: true } // Enable deep watching and run immediately on mount
    );

    // Computed properties
    const options = computed(() => {
      return props.content?.options || [];
    });

    const filteredOptions = computed(() => {
      if (!searchQuery.value) return options.value;
      
      return options.value.filter(option => {
        const label = getOptionLabel(option);
        return label.toLowerCase().includes(searchQuery.value.toLowerCase());
      });
    });

    const hasValue = computed(() => {
      if (props.content?.multiSelect) {
        return Array.isArray(internalValue.value) && internalValue.value.length > 0;
      }
      return internalValue.value !== null && internalValue.value !== undefined;
    });

    const selectedCount = computed(() => {
      if (props.content?.multiSelect && Array.isArray(internalValue.value)) {
        return internalValue.value.length;
      }
      return 0;
    });

    const displayLabel = computed(() => {
      return props.content?.label || 'Select';
    });

    const displayValue = computed(() => {
      if (!hasValue.value) return '';
      
      if (!props.content?.multiSelect) {
        const selectedOption = options.value.find(opt => {
          const optValue = getOptionValue(opt);
          // Use loose equality to handle string/number mismatches
          return optValue == internalValue.value || optValue === internalValue.value;
        });
        return selectedOption ? getOptionLabel(selectedOption) : String(internalValue.value);
      }
      
      return '';
    });

    // Methods
    const getOptionValue = (option) => {
      if (option === null) return null;
      return typeof option === 'object' ? option.value : option;
    };

    const getOptionLabel = (option) => {
      if (option === null) return '';
      return typeof option === 'object' ? option.label : String(option);
    };

    const getIconHtml = (option) => {
      if (!option || typeof option !== 'object' || !option.icon) return '';
      
      // Handle different icon types
      if (option.value === true) {
        return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-true"><circle cx="12" cy="12" r="10"></circle><path d="M8 12l2 2 6-6"></path></svg>';
      } else if (option.value === false) {
        return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-false"><circle cx="12" cy="12" r="10"></circle><path d="M15 9l-6 6"></path><path d="M9 9l6 6"></path></svg>';
      } else {
        return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-default"><circle cx="12" cy="12" r="10"></circle></svg>';
      }
    };

    const isOptionSelected = (option) => {
      const optionValue = getOptionValue(option);
      
      if (props.content?.multiSelect) {
        return Array.isArray(internalValue.value) && 
          internalValue.value.some(val => val === optionValue);
      }
      
      return internalValue.value === optionValue;
    };

    const selectOption = (option) => {
      if (isEditing.value) return;
      
      const optionValue = getOptionValue(option);
      
      if (props.content?.multiSelect) {
        const currentValue = Array.isArray(internalValue.value) ? [...internalValue.value] : [];
        const index = currentValue.indexOf(optionValue);
        
        if (index === -1) {
          currentValue.push(optionValue);
        } else {
          currentValue.splice(index, 1);
        }
        
        setInternalValue(currentValue);
        emitChangeEvent(currentValue);
      } else {
        setInternalValue(optionValue);
        emitChangeEvent(optionValue);
        closeDropdown();
      }
    };

    const clearSelection = (event) => {
      if (event) event.stopPropagation();
      if (isEditing.value) return;
      
      if (props.content?.multiSelect) {
        setInternalValue([]);
        emitChangeEvent([]);
      } else {
        setInternalValue(null);
        emitChangeEvent(null);
        closeDropdown();
      }
    };

    const resetToInitial = () => {
      if (isEditing.value) return;
      
      // Get initial value or use default
      let resetValue;
      if (props.content?.initialValue !== undefined && props.content?.initialValue !== null) {
        // Use the initial value from content
        resetValue = props.content.initialValue;
      } else {
        // Use default value based on mode
        resetValue = props.content?.multiSelect ? [] : null;
      }
      
      setInternalValue(resetValue);
      emitChangeEvent(resetValue);
      
      if (isOpen.value) {
        closeDropdown();
      }
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
      
      const buttonRect = triggerButton.value.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dropdownMinWidth = 280; // min-width from CSS
      const dropdownEstimatedHeight = 300; // estimated max height
      
      // Check if dropdown would overflow right side
      const spaceRight = viewportWidth - buttonRect.right;
      const spaceLeft = buttonRect.left;
      
      // If not enough space on the right and more space on the left, align to right
      if (spaceRight < dropdownMinWidth && spaceLeft > spaceRight) {
        alignRight.value = true;
      } else {
        alignRight.value = false;
      }
      
      // Check if dropdown would overflow bottom
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      // If not enough space below and more space above, open upward
      if (spaceBelow < dropdownEstimatedHeight && spaceAbove > spaceBelow) {
        openUpward.value = true;
      } else {
        openUpward.value = false;
      }
    };

    const openDropdown = () => {
      if (isEditing.value) return;
      
      isOpen.value = true;
      searchQuery.value = '';
      
      // Calculate dropdown position on next tick after it's rendered
      nextTick(() => {
        calculateDropdownPosition();
        
        if (!props.content?.hideSearchBar && searchInput.value) {
          searchInput.value.focus();
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
      searchQuery.value = '';
      
      emit('trigger-event', {
        name: 'close',
        event: {}
      });
    };

    const onSearchInput = () => {
      // Clear existing debounce timer
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
      
      // Get debounce delay from content or use default
      const debounceDelay = props.content?.debounceSearch ?? 300;
      
      // Set new debounce timer to emit search-change event
      searchDebounceTimer = setTimeout(() => {
        emit('trigger-event', {
          name: 'search-change',
          event: {
            query: searchQuery.value
          }
        });
      }, debounceDelay);
      
      // Local filtering happens immediately via the reactive filteredOptions computed property
    };

    const emitChangeEvent = (newValue) => {
      emit('trigger-event', {
        name: 'change',
        event: { value: newValue }
      });
    };

    // Handle scroll for infinite loading
    const handleScroll = () => {
      if (!optionsList.value || props.content?.isLoadingMore) return;
      
      const { scrollTop, scrollHeight, clientHeight } = optionsList.value;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      // Trigger when user scrolls to 80% of the list
      if (scrollPercentage >= 0.8) {
        emit('trigger-event', {
          name: 'reach-last-item',
          event: {
            scrollTop,
            scrollHeight,
            clientHeight
          }
        });
      }
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
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    });

    return {
      isEditing,
      isOpen,
      searchQuery,
      triggerButton,
      searchInput,
      optionsList,
      alignRight,
      openUpward,
      internalValue,
      setInternalValue,
      options,
      filteredOptions,
      hasValue,
      selectedCount,
      displayLabel,
      displayValue,
      getOptionValue,
      getOptionLabel,
      getIconHtml,
      isOptionSelected,
      selectOption,
      clearSelection,
      resetToInitial,
      toggleDropdown,
      openDropdown,
      closeDropdown,
      onSearchInput,
      handleScroll
    };
  }
};
</script>

<style lang="scss" scoped>
.combobox-container {
  position: relative;
  display: inline-block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  
  .combobox-trigger {
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
      
      .selection-count, .selected-value {
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
    width: 100%;
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
  
  .search-container {
    position: relative;
    padding: 8px;
    border-bottom: 1px solid #E5E7EB;
    
    .search-icon {
      position: absolute;
      top: 50%;
      left: 16px;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9CA3AF;
      pointer-events: none;
    }
    
    .search-input {
      width: 100%;
      padding: 8px 8px 8px 32px;
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
  
  .options-list {
    max-height: 256px;
    overflow-y: auto;
    padding: 4px;
    
    .option-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      background: none;
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: #F9FAFB;
      }
      
      &.is-selected {
        background-color: #EFF6FF;
        color: #1D4ED8;
        font-weight: 500;
      }
      
      .option-content {
        display: flex;
        align-items: center;
        
        .option-icon {
          display: flex;
          margin-right: 8px;
          
          :deep(.icon-true) {
            color: #16A34A;
          }
          
          :deep(.icon-false) {
            color: #DC2626;
          }
          
          :deep(.icon-default) {
            color: #9CA3AF;
          }
        }
      }
      
      .check-icon {
        color: #3B82F6;
      }
    }
    
    .no-results {
      padding: 16px;
      text-align: center;
      color: #6B7280;
      font-size: 14px;
    }
    
    .loading-container,
    .loading-more-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      gap: 8px;
      
      .loading-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #E5E7EB;
        border-top-color: #3B82F6;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        
        &.small {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }
      }
      
      .loading-text {
        margin: 0;
        font-size: 12px;
        color: #6B7280;
      }
    }
    
    .loading-more-container {
      padding: 12px;
      border-top: 1px solid #E5E7EB;
    }
  }
  
  .dropdown-footer {
    padding: 8px;
    border-top: 1px solid #E5E7EB;
    
    .selection-summary {
      margin-bottom: 8px;
      padding: 8px;
      background-color: #EFF6FF;
      border-radius: 6px;
      
      .selection-text {
        margin: 0;
        font-size: 12px;
        font-weight: 500;
        color: #1D4ED8;
      }
    }
    
    .clear-all-button {
      width: 100%;
      padding: 8px;
      background: none;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #4B5563;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: #F9FAFB;
        color: #1F2937;
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
