export default {
  editor: {
    label: {
      en: 'Dropdown'
    },
    icon: 'chevron-down'
  },
  properties: {
    label: {
      label: { en: 'Button Label' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Select',
      section: 'settings',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The label displayed on the trigger button when no option is selected'
      },
      propertyHelp: {
        tooltip: 'The text displayed on the trigger button. When an option is selected, the button shows the selected option label instead.'
      }
      /* wwEditor:end */
    },
    dropdownOptions: {
      label: { en: 'Options' },
      type: 'Array',
      bindable: true,
      section: 'settings',
      defaultValue: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      options: {
        expandable: true,
        getItemLabel(_, index) {
          return `Option ${index + 1}`;
        },
        item: {
          type: 'Object',
          defaultValue: {
            value: '',
            label: '',
            icon: null,
            disabled: false
          },
          options: {
            item: {
              value: {
                label: 'Value',
                type: 'Text',
                options: { placeholder: 'Value' }
              },
              label: {
                label: 'Label',
                type: 'Text',
                options: { placeholder: 'Label' }
              },
              icon: {
                label: 'Icon (HTML)',
                type: 'Text',
                options: { placeholder: 'Icon HTML (optional)' }
              },
              disabled: {
                label: 'Disabled',
                type: 'OnOff'
              }
            }
          }
        }
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'An array of options to display in the dropdown'
      },
      propertyHelp: {
        tooltip: 'The list of options. Each option should have value, label, optional icon (HTML), and optional disabled flag.'
      }
      /* wwEditor:end */
    },
    selectedOption: {
      label: { en: 'Selected Option' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: null,
      /* wwEditor:start */
      bindingValidation: {
        type: 'any',
        tooltip: 'The currently selected option value'
      },
      propertyHelp: {
        tooltip: 'The value of the currently selected option. Bind this to a variable to control the selection externally.'
      }
      /* wwEditor:end */
    },
    variant: {
      label: { en: 'Variant' },
      type: 'TextSelect',
      bindable: true,
      section: 'settings',
      defaultValue: 'default',
      options: {
        options: [
          { value: 'default', label: 'Default' },
          { value: 'primary', label: 'Primary' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'neutralSecondary', label: 'Neutral Secondary' },
          { value: 'brandTertiary', label: 'Brand Tertiary' },
          { value: 'neutralTertiary', label: 'Neutral Tertiary' },
          { value: 'destructive', label: 'Destructive' },
          { value: 'destructiveSecondary', label: 'Destructive Secondary' },
          { value: 'destructiveTertiary', label: 'Destructive Tertiary' },
          { value: 'success', label: 'Success' },
          { value: 'successSecondary', label: 'Success Secondary' },
          { value: 'outline', label: 'Outline' },
          { value: 'ghost', label: 'Ghost' }
        ]
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The button variant style'
      },
      propertyHelp: {
        tooltip: 'Choose the visual style of the trigger button. Each variant has different colors for background, text, and border.'
      }
      /* wwEditor:end */
    },
    size: {
      label: { en: 'Size' },
      type: 'TextSelect',
      bindable: true,
      section: 'settings',
      defaultValue: 'default',
      options: {
        options: [
          { value: 'default', label: 'Default (36px)' },
          { value: 'sm', label: 'Small (32px)' },
          { value: 'lg', label: 'Large (40px)' },
          { value: 'icon', label: 'Icon (36x36)' }
        ]
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The button size'
      },
      propertyHelp: {
        tooltip: 'Choose the size of the trigger button.'
      }
      /* wwEditor:end */
    },
    disabled: {
      label: { en: 'Disabled' },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Disable the dropdown'
      },
      propertyHelp: {
        tooltip: 'When enabled, the dropdown button is disabled and cannot be clicked.'
      }
      /* wwEditor:end */
    },
    isLoading: {
      label: { en: 'Is Loading' },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'External loading state for the dropdown'
      },
      propertyHelp: {
        tooltip: 'Set to true to show a loading spinner on the button. The component also manages internal loading state when an option is clicked.'
      }
      /* wwEditor:end */
    },
    enableSearch: {
      label: { en: 'Enable Search' },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Enable search functionality in the dropdown'
      },
      propertyHelp: {
        tooltip: 'When enabled, adds a search input at the top of the dropdown to filter options.'
      }
      /* wwEditor:end */
    },
    searchPlaceholder: {
      label: { en: 'Search Placeholder' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: 'Search...',
      hidden: content => !content.enableSearch,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Placeholder text for the search input'
      },
      propertyHelp: {
        tooltip: 'The placeholder text shown in the search input when it is empty.'
      }
      /* wwEditor:end */
    },
    debounceSearch: {
      label: { en: 'Search debounce (ms)' },
      type: 'Number',
      bindable: true,
      section: 'settings',
      defaultValue: 500,
      hidden: content => !content.enableSearch,
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Debounce delay in milliseconds for search input'
      },
      propertyHelp: {
        tooltip: 'The delay in milliseconds before triggering the search-change event. Useful to reduce API calls when searching.'
      }
      /* wwEditor:end */
    },
    isLoadingMore: {
      label: { en: 'Is loading more' },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show loading more indicator at the bottom of the list'
      },
      propertyHelp: {
        tooltip: 'When enabled, displays a "loading more" indicator at the bottom of the options list. Use this for infinite scroll pagination.'
      }
      /* wwEditor:end */
    },
    noOptionsText: {
      label: { en: 'No Options Text' },
      type: 'Text',
      bindable: true,
      section: 'settings',
      defaultValue: 'No options available',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text to display when no options are available'
      },
      propertyHelp: {
        tooltip: 'The text shown when there are no options to display or when search returns no results.'
      }
      /* wwEditor:end */
    },
    enableLabelClick: {
      label: { en: 'Enable Label Click' },
      type: 'OnOff',
      bindable: true,
      section: 'settings',
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Enable label click to trigger custom action instead of toggling dropdown'
      },
      propertyHelp: {
        tooltip: 'When enabled, clicking the label will trigger the "On label click" event instead of toggling the dropdown. The label will show an underline on hover.'
      }
      /* wwEditor:end */
    }
  },
  triggerEvents: [
    {
      name: 'optionClick',
      label: { en: 'On option click' },
      event: { value: null, option: null },
      default: true
    },
    {
      name: 'change',
      label: { en: 'On value change' },
      event: { value: null }
    },
    {
      name: 'clear',
      label: { en: 'On clear' },
      event: {}
    },
    {
      name: 'open',
      label: { en: 'On dropdown open' },
      event: {}
    },
    {
      name: 'close',
      label: { en: 'On dropdown close' },
      event: {}
    },
    {
      name: 'search-change',
      label: { en: 'On search change' },
      event: {
        query: ''
      }
    },
    {
      name: 'reach-last-item',
      label: { en: 'On reach last item' },
      event: {
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0
      }
    },
    {
      name: 'label-click',
      label: { en: 'On label click' },
      event: {}
    }
  ],
  actions: [
    {
      action: 'openDropdown',
      label: { en: 'Open dropdown' }
    },
    {
      action: 'closeDropdown',
      label: { en: 'Close dropdown' }
    },
    {
      action: 'clearSelection',
      label: { en: 'Clear selection' }
    }
  ]
};