<template>
  <div 
    class="inline-editable-input" 
    :class="{ 
      'is-disabled': content.isDisabled, 
      'is-loading': content.isLoading,
      'is-focused': isFocused,
      'is-hovered': isHovered && !isFocused && !content.isDisabled,
      'has-error': hasValidationError,
      'has-ellipsis': content.noWrap && content.ellipsis,
      [`size-${content.size}`]: content.size
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Text display when not editing -->
    <div 
      v-if="!isEditing" 
      class="display-text-wrapper"
    >
      <div 
        class="display-text"
        :style="displayTextStyle"
        @click="content.useDatePicker ? openNativeDatePicker() : startEditing()"
      >
        <span :style="displayTextContentStyle">{{ displayValue }}</span>
        <div v-if="content.isLoading" class="loading-indicator">
          <div class="spinner"></div>
        </div>
      </div>
      
      <!-- Hidden native date input -->
      <input
        v-if="content.useDatePicker"
        ref="nativeDateInput"
        type="date"
        class="native-date-input"
        :value="nativeDateValue"
        :min="content.minDate"
        :max="content.maxDate"
        @change="handleNativeDateChange"
      />
    </div>
    
    <!-- Input when editing -->
    <div v-else class="edit-container">
      <div class="input-wrapper">
        <input
          ref="inputElement"
          v-model="inputValue"
          class="edit-input"
          :class="{ 'has-error': hasValidationError, 'has-date-picker': content.useDatePicker }"
          :style="inputStyle"
          :disabled="content.isDisabled || isProcessing"
          @blur="handleBlur"
          @keydown.enter="handleEnter"
          @keydown.esc="cancelEditing"
          @input="handleInput"
        />
        
        <!-- Hidden native date input for edit mode -->
        <input
          v-if="content.useDatePicker"
          ref="nativeDateInputEdit"
          type="date"
          class="native-date-input"
          :value="nativeDateValue"
          :min="content.minDate"
          :max="content.maxDate"
          @change="handleNativeDateChange"
        />
      </div>
      <div v-if="hasValidationError" class="error-message">
        {{ validationErrorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, watchEffect, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { debounce } from 'lodash';

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
    const isEditing = ref(false);
    const isHovered = ref(false);
    const isFocused = ref(false);
    const isProcessing = ref(false);
    const inputElement = ref(null);
    const validationError = ref(false);
    
    // Native date picker refs
    const nativeDateInput = ref(null);
    const nativeDateInputEdit = ref(null);
    
    // Internal value management
    const { value: internalValue, setValue: setInternalValue } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'value',
      type: 'string',
      defaultValue: computed(() => props.content.initialValue ?? '')
    });
    
    // Input value for editing
    const inputValue = ref('');
    
    // Determine if we're in the editor
    const isInEditor = computed(() => {
      /* wwEditor:start */
      return props.wwEditorState.isEditing;
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    });
    
    // Display value (what's shown when not editing)
    const displayValue = computed(() => {
      const value = internalValue.value;
      if (!value) return props.content.placeholder || '';
      
      // If using date picker and we have a date, format it for display
      if (props.content.useDatePicker && value) {
        return formatDateForDisplay(value);
      }
      
      return value;
    });
    
    // Convert internal value to native date input format (yyyy-MM-dd)
    const nativeDateValue = computed(() => {
      const value = internalValue.value;
      if (!value) return '';
      
      // Try to parse and convert to yyyy-MM-dd
      const date = parseDate(value);
      if (date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      return value;
    });
    
    // Format date for display based on dateFormat prop
    const formatDateForDisplay = (value) => {
      const date = parseDate(value);
      if (!date) return value;
      
      const format = props.content.dateFormat || 'yyyy-MM-dd';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return format
        .replace('yyyy', year)
        .replace('MM', month)
        .replace('dd', day);
    };
    
    // Parse various date formats
    const parseDate = (str) => {
      if (!str) return null;
      
      const formats = [
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // yyyy-MM-dd
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/dd/yyyy
        /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/, // yyyy/MM/dd
        /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // dd-MM-yyyy
      ];
      
      for (const regex of formats) {
        const match = str.match(regex);
        if (match) {
          let year, month, day;
          if (regex === formats[1]) {
            month = parseInt(match[1], 10) - 1;
            day = parseInt(match[2], 10);
            year = parseInt(match[3], 10);
          } else if (regex === formats[3]) {
            day = parseInt(match[1], 10);
            month = parseInt(match[2], 10) - 1;
            year = parseInt(match[3], 10);
          } else {
            year = parseInt(match[1], 10);
            month = parseInt(match[2], 10) - 1;
            day = parseInt(match[3], 10);
          }
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) return date;
        }
      }
      
      return null;
    };
    
    // Open native date picker
    const openNativeDatePicker = () => {
      const input = isEditing.value ? nativeDateInputEdit.value : nativeDateInput.value;
      if (input) {
        input.showPicker();
      }
    };
    
    // Handle native date picker change
    const handleNativeDateChange = (event) => {
      const dateValue = event.target.value; // yyyy-MM-dd format
      
      // Format the date according to user's preference
      const formattedDate = dateValue ? formatDateForDisplay(dateValue) : '';
      
      // Validate the new value
      const isValid = validateInput(formattedDate);
      
      if (!isValid && props.content.showValidateError) {
        validationError.value = true;
      } else {
        validationError.value = false;
      }
      
      setInternalValue(formattedDate);
      inputValue.value = formattedDate;
      
      emit('trigger-event', {
        name: 'change',
        event: { value: formattedDate }
      });
      
      emit('trigger-event', {
        name: 'dateSelected',
        event: { value: formattedDate, rawValue: dateValue }
      });
      
      // Trigger blur event as requested
      emit('trigger-event', {
        name: 'blur',
        event: { value: formattedDate }
      });
      
      // Exit edit mode if was editing
      if (isEditing.value) {
        isEditing.value = false;
        isFocused.value = false;
      }
    };
    
    // Validation logic
    const validateInput = (value) => {
      // If value is empty
      if (!value || value.trim() === '') {
        // Only validate if field is required
        return !props.content.required;
      }
      
      // If no pattern is set, consider it valid
      if (!props.content.validatePattern) {
        return true;
      }
      
      try {
        const regex = new RegExp(props.content.validatePattern);
        return regex.test(value);
      } catch (e) {
        console.error('Invalid regex pattern:', e);
        return true; // If pattern is invalid, don't block user
      }
    };
    
    const hasValidationError = computed(() => {
      return props.content.showValidateError && validationError.value && isEditing.value;
    });
    
    const validationErrorMessage = computed(() => {
      return props.content.validateErrorMessage || '無効な入力';
    });
    
    // Style computations
    const displayTextStyle = computed(() => {
      const styles = {};
      
      // Apply default state styles
      if (props.content.defaultStateStyles) {
        if (props.content.defaultStateStyles.color) {
          styles.color = props.content.defaultStateStyles.color;
        }
        if (props.content.defaultStateStyles.fontFamily) {
          styles.fontFamily = props.content.defaultStateStyles.fontFamily;
        }
        if (props.content.defaultStateStyles.fontSize) {
          styles.fontSize = props.content.defaultStateStyles.fontSize;
        }
        if (props.content.defaultStateStyles.fontWeight) {
          styles.fontWeight = props.content.defaultStateStyles.fontWeight;
        }
        if (props.content.defaultStateStyles.fontStyle) {
          styles.fontStyle = props.content.defaultStateStyles.fontStyle;
        }
        if (props.content.defaultStateStyles.textDecoration) {
          styles.textDecoration = props.content.defaultStateStyles.textDecoration;
        }
      }
      
      // Apply hover state styles if hovered
      if (isHovered.value && props.content.hoverStateStyles) {
        if (props.content.hoverStateStyles.color) {
          styles.color = props.content.hoverStateStyles.color;
        }
        if (props.content.hoverStateStyles.fontFamily) {
          styles.fontFamily = props.content.hoverStateStyles.fontFamily;
        }
        if (props.content.hoverStateStyles.fontSize) {
          styles.fontSize = props.content.hoverStateStyles.fontSize;
        }
        if (props.content.hoverStateStyles.fontWeight) {
          styles.fontWeight = props.content.hoverStateStyles.fontWeight;
        }
        if (props.content.hoverStateStyles.fontStyle) {
          styles.fontStyle = props.content.hoverStateStyles.fontStyle;
        }
        if (props.content.hoverStateStyles.textDecoration) {
          styles.textDecoration = props.content.hoverStateStyles.textDecoration;
        }
      }
      
      return styles;
    });
    
    const displayTextContentStyle = computed(() => {
      const styles = {};
      if (props.content.noWrap) {
        styles.whiteSpace = 'nowrap';
      }
      if (props.content.noWrap && props.content.ellipsis) {
        styles.overflow = 'hidden';
        styles.textOverflow = 'ellipsis';
        styles.display = 'block';
      }
      return styles;
    });
    
    const inputStyle = computed(() => {
      const styles = {};
      
      // Apply focus state styles
      if (props.content.focusStateStyles) {
        if (props.content.focusStateStyles.color) {
          styles.color = props.content.focusStateStyles.color;
        }
        if (props.content.focusStateStyles.fontFamily) {
          styles.fontFamily = props.content.focusStateStyles.fontFamily;
        }
        if (props.content.focusStateStyles.fontSize) {
          styles.fontSize = props.content.focusStateStyles.fontSize;
        }
        if (props.content.focusStateStyles.fontWeight) {
          styles.fontWeight = props.content.focusStateStyles.fontWeight;
        }
        if (props.content.focusStateStyles.fontStyle) {
          styles.fontStyle = props.content.focusStateStyles.fontStyle;
        }
        if (props.content.focusStateStyles.textDecoration) {
          styles.textDecoration = props.content.focusStateStyles.textDecoration;
        }
        if (props.content.focusStateStyles.backgroundColor) {
          styles.backgroundColor = props.content.focusStateStyles.backgroundColor;
        }
        if (props.content.focusStateStyles.borderColor) {
          styles.borderColor = props.content.focusStateStyles.borderColor;
        }
      }
      
      return styles;
    });
    
    // Create debounced value change handler
    // Store the debounced function in a ref so we can cancel and recreate it
    let debouncedValueChange = null;
    
    // Recreate debounce function when debounceTime changes
    watchEffect(() => {
      // Cancel any pending debounced call when recreating
      if (debouncedValueChange) {
        debouncedValueChange.cancel();
      }
      
      const debounceTime = props.content.debounceTime ?? 300;
      
      debouncedValueChange = debounce((newValue) => {
        // Only trigger change event if the input is valid
        const isValid = validateInput(newValue);
        
        if (isValid && internalValue.value !== newValue) {
          setInternalValue(newValue);
          emit('trigger-event', {
            name: 'change',
            event: { value: newValue }
          });
        }
      }, debounceTime);
    });
    
    // Cleanup on unmount
    onBeforeUnmount(() => {
      if (debouncedValueChange) {
        debouncedValueChange.cancel();
      }
    });
    
    // Watch for changes to the input value
    watch(inputValue, (newValue) => {
      if (debouncedValueChange) {
        debouncedValueChange(newValue);
      }
    });
    
    // Watch for changes to the initial value
    watch(() => props.content.initialValue, (newValue) => {
      if (newValue !== undefined && newValue !== internalValue.value) {
        setInternalValue(newValue);
        emit('trigger-event', {
          name: 'initValueChange',
          event: { value: newValue }
        });
      }
    });
    
    // Processing state control - allows the component to disable itself
    const setProcessing = (value) => {
      isProcessing.value = !!value;
    };
    
    // Event handlers
    const startEditing = () => {
      if (isInEditor.value || props.content.isDisabled || props.content.isLoading || isProcessing.value) return;
      
      isEditing.value = true;
      isFocused.value = true;
      inputValue.value = internalValue.value || '';
      
      nextTick(() => {
        if (inputElement.value) {
          inputElement.value.focus();
        }
      });
    };
    
    const handleBlur = () => {
      // Validate before triggering blur event
      const isValid = validateInput(inputValue.value);
      
      finishEditing();
      isFocused.value = false;
      
      // Only emit blur event if the input is valid
      if (isValid) {
        emit('trigger-event', {
          name: 'blur',
          event: { value: internalValue.value }
        });
      }
    };
    
    const handleEnter = () => {
      finishEditing();
    };
    
    const cancelEditing = () => {
      isEditing.value = false;
      isFocused.value = false;
      inputValue.value = internalValue.value || '';
    };
    
    const finishEditing = () => {
      // Validate before finishing
      const isValid = validateInput(inputValue.value);
      
      if (!isValid && props.content.showValidateError) {
        validationError.value = true;
        return; // Don't finish editing if validation fails
      }
      
      validationError.value = false;
      isEditing.value = false;
      setInternalValue(inputValue.value);
    };
    
    const handleInput = () => {
      // Clear validation error as user types
      if (validationError.value) {
        validationError.value = false;
      }
    };
    
    const handleMouseEnter = () => {
      if (!isInEditor.value) {
        isHovered.value = true;
      }
    };
    
    const handleMouseLeave = () => {
      isHovered.value = false;
    };
    
    return {
      isEditing,
      isHovered,
      isFocused,
      isProcessing,
      inputElement,
      inputValue,
      internalValue,
      displayValue,
      displayTextStyle,
      displayTextContentStyle,
      inputStyle,
      hasValidationError,
      validationErrorMessage,
      startEditing,
      handleBlur,
      handleEnter,
      handleInput,
      cancelEditing,
      handleMouseEnter,
      handleMouseLeave,
      setProcessing,
      // Date picker
      nativeDateInput,
      nativeDateInputEdit,
      nativeDateValue,
      openNativeDatePicker,
      handleNativeDateChange
    };
  }
};
</script>

<style lang="scss" scoped>
.inline-editable-input {
  position: relative;
  display: inline-block;
  min-width: 50px;
  
  &.has-ellipsis {
    display: block;
    width: 100%;
    min-width: 0;
    
    .display-text-wrapper {
      min-width: 0;
      overflow: hidden;
    }
    
    .display-text {
      min-width: 0;
      overflow: hidden;
    }
  }
  
  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    .display-text {
      cursor: not-allowed;
    }
  }
  
  &.is-hovered {
    .display-text {
      cursor: text;
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: currentColor;
        opacity: 0.5;
      }
    }
  }
  
  &.size-small {
    font-size: 0.875rem;
    
    .edit-input {
      padding: 2px 4px;
    }
  }
  
  &.size-medium {
    font-size: 1rem;
    
    .edit-input {
      padding: 4px 6px;
    }
  }
  
  &.size-large {
    font-size: 1.25rem;
    
    .edit-input {
      padding: 6px 8px;
    }
  }
  
  .display-text-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
  }
  
  .display-text {
    position: relative;
    cursor: pointer;
    padding: 2px 0;
    min-height: 1em;
  }
  
  .date-picker-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    border-radius: 4px;
    color: #333;
    cursor: pointer;
    transition: all 0.15s ease;
    
    &:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #000;
    }
    
    &:active {
      background: rgba(0, 0, 0, 0.1);
    }
    
    &.editing {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      
      &:hover {
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.05);
      }
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  .native-date-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }
  
  .input-wrapper {
    position: relative;
    width: 100%;
  }
  
  .edit-container {
    width: 100%;
  }
  
  .edit-input {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    background-color: white;
    font-family: inherit;
    font-size: inherit;
    
    &.has-date-picker {
      padding-right: 32px;
    }
    
    &:focus {
      border-color: #4a90e2;
      box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    }
    
    &.has-error {
      border-color: #e74c3c;
      
      &:focus {
        border-color: #e74c3c;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
      }
    }
  }
  
  .error-message {
    color: #e74c3c;
    font-size: 0.875em;
    margin-top: 4px;
    animation: slideDown 0.2s ease-out;
  }
  
  .loading-indicator {
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    
    .spinner {
      width: 12px;
      height: 12px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-top-color: #4a90e2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>