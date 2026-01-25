<template>
  <div class="dropdown-container" :class="{ 'is-open': isOpen }">
    <!-- Trigger Button -->
    <button
      ref="triggerButton"
      class="dropdown-trigger"
      :class="[
        variantClass,
        sizeClass,
        { 
          'has-value': hasValue,
          'is-loading': isLoadingState,
          'is-disabled': content.disabled
        }
      ]"
      :disabled="content.disabled || isLoadingState"
      @click="toggleDropdown"
    >
      <span v-if="isLoadingState" class="loading-spinner"></span>
      <span 
        class="trigger-label" 
        :class="{ 'has-label-click': content.enableLabelClick }"
        @click.stop="handleLabelClick"
      >{{ displayLabel }}</span>
      <svg 
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
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen" 
      class="dropdown-menu"
      :class="{
        'align-right': alignRight,
        'open-upward': openUpward
      }"
    >
      <div v-if="showSearch" class="search-container">
        <input
          ref="searchInput"
          type="text"
          class="search-input"
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
          @input="onSearchInput"
          @click.stop
        />
      </div>
      <div 
        ref="optionsList"
        class="dropdown-items-container"
        @scroll="handleScroll"
      >
        <button
          v-for="(option, index) in filteredOptions"
          :key="index"
          class="dropdown-item"
          :class="{ 
            'is-selected': isOptionSelected(option),
            'is-disabled': option.disabled
          }"
          :disabled="option.disabled || isLoadingState"
          @click="handleOptionClick(option)"
        >
          <span v-if="option.icon" class="option-icon" v-html="option.icon"></span>
          <span class="option-label">{{ getOptionLabel(option) }}</span>
          <span v-if="isOptionSelected(option)" class="check-icon">✓</span>
        </button>
        <div v-if="filteredOptions.length === 0" class="no-options">
          {{ noOptionsText }}
        </div>
        <div v-if="content.isLoadingMore" class="loading-more-container">
          <div class="loading-spinner small"></div>
          <p class="loading-text">Loading more...</p>
        </div>
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
    const searchInput = ref(null);
    const optionsList = ref(null);
    const alignRight = ref(false);
    const openUpward = ref(false);
    const internalLoading = ref(false);
    const searchQuery = ref('');
    let searchDebounceTimer = null;

    // Internal value management
    const { value: internalValue, setValue: setInternalValue } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'value',
      type: 'any',
      defaultValue: computed(() => props.content?.selectedOption ?? null),
    });

    // Watch for external selectedOption changes
    watch(
      () => props.content?.selectedOption,
      (newValue) => {
        if (!isEqual(newValue, internalValue.value)) {
          setInternalValue(newValue);
        }
      },
      { immediate: true, deep: true }
    );

    // Reset search query when dropdown closes
    watch(isOpen, (newValue) => {
      if (!newValue) {
        searchQuery.value = '';
      } else {
        nextTick(() => {
          if (props.content?.enableSearch && searchInput.value) {
            searchInput.value.focus();
          }
        });
      }
    });


    const options = computed(() => {
      return props.content?.dropdownOptions || [];
    });

    const filteredOptions = computed(() => {
      if (!searchQuery.value || !props.content?.enableSearch) {
        return options.value;
      }
      
      const query = searchQuery.value.toLowerCase();
      return options.value.filter(option => {
        const label = getOptionLabel(option).toLowerCase();
        return label.includes(query);
      });
    });

    const isLoadingState = computed(() => {
      // External loading prop OR internal loading state
      return props.content?.isLoading || internalLoading.value;
    });

    const hasValue = computed(() => {
      return internalValue.value !== null && internalValue.value !== undefined;
    });

    const displayLabel = computed(() => {
      if (hasValue.value) {
        const selectedOpt = options.value.find(opt => 
          getOptionValue(opt) == internalValue.value || getOptionValue(opt) === internalValue.value
        );
        if (selectedOpt) {
          return getOptionLabel(selectedOpt);
        }
      }
      return props.content?.label || 'Select';
    });

    // Variant class mapping
    const variantClass = computed(() => {
      const variant = props.content?.variant || 'default';
      return `variant-${variant}`;
    });

    const sizeClass = computed(() => {
      const size = props.content?.size || 'default';
      return `size-${size}`;
    });

    const showSearch = computed(() => {
      return props.content?.enableSearch === true;
    });

    const searchPlaceholder = computed(() => {
      return props.content?.searchPlaceholder || 'Search...';
    });

    const noOptionsText = computed(() => {
      return props.content?.noOptionsText || 'No options available';
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

    const isOptionSelected = (option) => {
      const optionValue = getOptionValue(option);
      return optionValue == internalValue.value || optionValue === internalValue.value;
    };

    const handleOptionClick = async (option) => {
      if (isEditing.value || option.disabled || isLoadingState.value) return;

      const optionValue = getOptionValue(option);

      // Set internal loading state
      internalLoading.value = true;

      try {
        // Emit the optionClick event and wait for any async handlers
        emit('trigger-event', {
          name: 'optionClick',
          event: { 
            value: optionValue,
            option: option
          }
        });

        // Update internal value
        setInternalValue(optionValue);

        // Emit change event
        emit('trigger-event', {
          name: 'change',
          event: { value: optionValue }
        });

        // Close dropdown after selection
        closeDropdown();
      } catch (error) {
        console.error('Error in option click handler:', error);
      } finally {
        // Clear internal loading state after a short delay
        // This allows external async operations to complete
        setTimeout(() => {
          internalLoading.value = false;
        }, 100);
      }
    };

    const handleLabelClick = (event) => {
      if (isEditing.value) return;
      
      // Only trigger label-click event if enableLabelClick is true
      if (props.content?.enableLabelClick) {
        // Prevent the dropdown from toggling
        event.stopPropagation();
        
        // Emit the label-click event
        emit('trigger-event', {
          name: 'label-click',
          event: {}
        });
      }
      // If enableLabelClick is false, let the click propagate to toggle the dropdown
    };

    const toggleDropdown = () => {
      if (isEditing.value || props.content?.disabled || isLoadingState.value) return;

      if (isOpen.value) {
        closeDropdown();
      } else {
        openDropdown();
      }
    };

    const onSearchInput = () => {
      // Clear existing debounce timer
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
      
      // Get debounce delay from content or use default
      const debounceDelay = props.content?.debounceSearch ?? 500;
      
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

    const calculateDropdownPosition = () => {
      if (!triggerButton.value) return;

      const win = wwLib.getFrontWindow();
      const doc = wwLib.getFrontDocument();
      const buttonRect = triggerButton.value.getBoundingClientRect();
      const viewportWidth = win.innerWidth;
      const viewportHeight = win.innerHeight;
      const dropdownMinWidth = 200;
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
      if (isEditing.value || props.content?.disabled) return;

      isOpen.value = true;

      nextTick(() => {
        calculateDropdownPosition();
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

    const clearSelection = () => {
      if (isEditing.value) return;
      
      setInternalValue(null);
      
      emit('trigger-event', {
        name: 'change',
        event: { value: null }
      });
      
      emit('trigger-event', {
        name: 'clear',
        event: {}
      });
      
      closeDropdown();
    };

    // Handle click outside
    const handleClickOutside = (event) => {
      if (isOpen.value && 
          triggerButton.value && 
          !triggerButton.value.contains(event.target) &&
          !event.target.closest('.dropdown-menu')) {
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
      triggerButton,
      searchInput,
      optionsList,
      alignRight,
      openUpward,
      internalValue,
      options,
      filteredOptions,
      isLoadingState,
      hasValue,
      displayLabel,
      variantClass,
      sizeClass,
      showSearch,
      searchQuery,
      searchPlaceholder,
      noOptionsText,
      getOptionValue,
      getOptionLabel,
      isOptionSelected,
      handleOptionClick,
      handleLabelClick,
      toggleDropdown,
      openDropdown,
      closeDropdown,
      clearSelection,
      onSearchInput,
      handleScroll
    };
  }
};
</script>

<style lang="scss" scoped>
.dropdown-container {
  position: relative;
  display: inline-block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  .dropdown-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid;

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px #8298F0;
    }

    &.is-disabled,
    &:disabled {
      pointer-events: none;
      opacity: 0.5;
    }

    &.is-loading {
      pointer-events: none;
    }

    // Size variants
    &.size-default {
      min-height: 36px;
      padding: 8px 16px;
    }

    &.size-sm {
      min-height: 32px;
      padding: 6px 12px;
      font-size: 12px;
    }

    &.size-lg {
      min-height: 40px;
      padding: 10px 32px;
    }

    &.size-icon {
      min-height: 36px;
      width: 36px;
      padding: 0;
    }

    // Variant styles
    &.variant-default {
      background-color: #242424;
      color: white;
      border-color: #131313;

      &:hover:not(:disabled) {
        background-color: #131313;
      }

      &:active:not(:disabled) {
        background-color: #0D0D0D;
      }
    }

    &.variant-primary {
      background-color: #06259F;
      color: white;
      border-color: #021975;

      &:hover:not(:disabled) {
        background-color: #051F85;
      }

      &:active:not(:disabled) {
        background-color: #041A6B;
      }
    }

    &.variant-secondary {
      background-color: #E9EDFF;
      color: #06259F;
      border-color: #D6DEFD;

      &:hover:not(:disabled) {
        background-color: #D6DEFD;
      }

      &:active:not(:disabled) {
        background-color: #C4CFFB;
      }
    }

    &.variant-neutralSecondary {
      background-color: var(--button-secondary-neutral-bg-default, #F5F5F5);
      color: var(--button-secondary-neutral-text-active, #242424);
      border-color: var(--button-secondary-neutral-border-active, #E0E0E0);

      &:hover:not(:disabled) {
        background-color: var(--button-secondary-neutral-bg-hover, #EBEBEB);
      }

      &:active:not(:disabled) {
        background-color: var(--button-secondary-neutral-bg-pressed, #E0E0E0);
      }
    }

    &.variant-brandTertiary {
      background-color: #FFFFFF;
      color: #06259F;
      border-color: #EFEFEF;

      &:hover:not(:disabled) {
        background-color: #EFEFEF;
      }

      &:active:not(:disabled) {
        background-color: #E6E6E6;
      }
    }

    &.variant-neutralTertiary {
      background-color: #FFFFFF;
      color: #242424;
      border-color: #EFEFEF;

      &:hover:not(:disabled) {
        background-color: #EFEFEF;
      }

      &:active:not(:disabled) {
        background-color: #E6E6E6;
      }
    }

    &.variant-destructive {
      background-color: #9E1F00;
      color: #FFF7F5;
      border-color: #671800;

      &:hover:not(:disabled) {
        background-color: rgba(158, 31, 0, 0.9);
      }
    }

    &.variant-destructiveSecondary {
      background-color: #FCE6E2;
      color: #9E1F00;
      border-color: #F9D4CD;

      &:hover:not(:disabled) {
        background-color: #F9D4CD;
      }

      &:active:not(:disabled) {
        background-color: #F7C3B8;
      }
    }

    &.variant-destructiveTertiary {
      background-color: #FFFFFF;
      color: #9E1F00;
      border-color: #EFEFEF;

      &:hover:not(:disabled) {
        background-color: #EFEFEF;
      }

      &:active:not(:disabled) {
        background-color: #E6E6E6;
      }
    }

    &.variant-success {
      background-color: #007612;
      color: #F5FFF7;
      border-color: #0A5C0A;

      &:hover:not(:disabled) {
        background-color: #0A5C0A;
      }

      &:active:not(:disabled) {
        background-color: #003400;
      }
    }

    &.variant-successSecondary {
      background-color: #E0F9E4;
      color: #007612;
      border-color: #C9F4D1;

      &:hover:not(:disabled) {
        background-color: #C9F4D1;
      }

      &:active:not(:disabled) {
        background-color: #B2EFBF;
      }
    }

    &.variant-outline {
      background-color: transparent;
      color: #242424;
      border-color: #EFEFEF;

      &:hover:not(:disabled) {
        background-color: #F5F5F5;
      }
    }

    &.variant-ghost {
      background-color: transparent;
      color: #242424;
      border-color: transparent;

      &:hover:not(:disabled) {
        background-color: #F5F5F5;
      }
    }

    .loading-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .trigger-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      
      &.has-label-click {
        cursor: pointer;
        text-decoration: none;
        transition: text-decoration 0.2s ease;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }

    .chevron-icon {
      flex-shrink: 0;
      transition: transform 0.2s ease;

      &.is-open {
        transform: rotate(180deg);
      }
    }
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 50;
    min-width: 100%;
    max-height: 280px;
    background-color: white;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 4px;
    display: flex;
    flex-direction: column;

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
    padding: 4px;
    border-bottom: 1px solid #E0E0E0;
    margin-bottom: 4px;
    
    .search-input {
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
    }
  }

  .dropdown-items-container {
    overflow-y: auto;
    max-height: 220px;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background: none;
    font-size: 14px;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover:not(:disabled) {
      background-color: #F5F5F5;
    }

    &.is-selected {
      background-color: #E9EDFF;
      color: #06259F;
      font-weight: 500;
    }

    &.is-disabled,
    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .option-icon {
      display: flex;
      flex-shrink: 0;
    }

    .option-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .check-icon {
      flex-shrink: 0;
      color: #06259F;
    }
  }

  .no-options {
    padding: 12px 16px;
    text-align: center;
    color: #6B7280;
    font-size: 14px;
  }

  .loading-more-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    gap: 8px;
    border-top: 1px solid #E5E7EB;
    
    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #E5E7EB;
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