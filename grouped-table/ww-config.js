export default {
  editor: {
    label: {
      en: 'Grouped Table',
      ja: 'グループ化テーブル'
    },
    icon: 'table',
    bubble: {
      icon: 'table'
    }
  },
  properties: {
    // ===================
    // Data Configuration
    // ===================
    data: {
      label: {
        en: 'Data Source',
        ja: 'データソース'
      },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Bind to a collection or array of objects'
      },
      propertyHelp: {
        tooltip: 'The data to display in the table. Should be an array of objects.'
      }
      /* wwEditor:end */
    },
    columns: {
      label: {
        en: 'Columns Configuration',
        ja: '列の設定'
      },
      type: 'Array',
      section: 'settings',
      options: {
        expandable: true,
        getItemLabel(item, index) {
          return item?.label || `Column ${index + 1}`;
        },
        item: {
          type: 'Object',
          options: {
            item: {
              key: {
                label: { en: 'Field Key', ja: 'フィールドキー' },
                type: 'Text'
              },
              label: {
                label: { en: 'Column Label', ja: '列ラベル' },
                type: 'Text'
              },
              width: {
                label: { en: 'Column Width', ja: '列幅' },
                type: 'Length',
                options: {
                  unitChoices: [
                    { value: 'px', label: 'px' },
                    { value: '%', label: '%' },
                    { value: 'auto', label: 'auto' }
                  ]
                },
                defaultValue: 'auto'
              },
              useDropzone: {
                label: { en: 'Use Custom Content', ja: 'カスタムコンテンツを使用' },
                type: 'OnOff',
                defaultValue: false
              }
            }
          }
        }
      },
      bindable: true,
      defaultValue: [
        { key: 'name', label: '名前', width: 'auto', useDropzone: false },
        { key: 'value', label: '値', width: 'auto', useDropzone: false }
      ],
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of column configurations with key, label, width, and useDropzone properties'
      },
      propertyHelp: {
        tooltip: 'Define the columns to display. key = field in your data, label = header text, width = px/% or auto, useDropzone = enable custom content.'
      }
      /* wwEditor:end */
    },
    groupByField: {
      label: {
        en: 'Group By Field',
        ja: 'グループ化フィールド'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'created_at',
      options: {
        placeholder: 'e.g., created_at, status, category'
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Field name to group the data by'
      },
      propertyHelp: {
        tooltip: 'The field in your data that will be used to group the records. Can use dot notation for nested fields.'
      }
      /* wwEditor:end */
    },
    groupColumnLabel: {
      label: {
        en: 'Group Column Label',
        ja: 'グループ列ラベル'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      options: {
        placeholder: 'e.g., 日付, カテゴリー'
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Header label for the group column'
      },
      propertyHelp: {
        tooltip: 'The label displayed in the header for the group column.'
      }
      /* wwEditor:end */
    },
    groupColumnWidth: {
      label: {
        en: 'Group Column Width',
        ja: 'グループ列幅'
      },
      type: 'Length',
      section: 'settings',
      bindable: true,
      options: {
        unitChoices: [
          { value: 'px', label: 'px' },
          { value: '%', label: '%' }
        ]
      },
      defaultValue: '150px',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Width of the group column (px or %)'
      },
      propertyHelp: {
        tooltip: 'The width of the group column. Use px or % values.'
      }
      /* wwEditor:end */
    },
    excludeGroupColumn: {
      label: {
        en: 'Exclude Group Field from Columns',
        ja: 'グループフィールドを列から除外'
      },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Whether to exclude the group field from the data columns'
      },
      propertyHelp: {
        tooltip: 'When enabled, the group field will only appear in the group column, not as a separate data column.'
      }
      /* wwEditor:end */
    },
    recordKey: {
      label: {
        en: 'Unique Record Key',
        ja: 'レコード一意キー'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'id',
      options: {
        placeholder: 'id'
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Field name that uniquely identifies each record'
      },
      propertyHelp: {
        tooltip: 'The field that uniquely identifies each record in your data. Used for optimized rendering.'
      }
      /* wwEditor:end */
    },

    // ===================
    // Display Options
    // ===================
    title: {
      label: {
        en: 'Table Title',
        ja: 'テーブルタイトル'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'グループ化テーブル',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Title text for the table'
      },
      propertyHelp: {
        tooltip: 'The title displayed above the table.'
      }
      /* wwEditor:end */
    },
    showHeader: {
      label: {
        en: 'Show Header',
        ja: 'ヘッダーを表示'
      },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Whether to show the table header with title and controls'
      },
      propertyHelp: {
        tooltip: 'Toggle visibility of the table header section that contains the title and expand/collapse buttons.'
      }
      /* wwEditor:end */
    },
    showTableHeader: {
      label: {
        en: 'Show Column Headers',
        ja: '列ヘッダーを表示'
      },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Whether to show the column headers'
      },
      propertyHelp: {
        tooltip: 'Toggle visibility of the column headers in the table.'
      }
      /* wwEditor:end */
    },
    defaultExpanded: {
      label: {
        en: 'Default Expanded',
        ja: 'デフォルトで展開'
      },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: false,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Whether all groups should be expanded by default'
      },
      propertyHelp: {
        tooltip: 'When enabled, all groups will be expanded when the component is first loaded.'
      }
      /* wwEditor:end */
    },

    // ===================
    // Group Formatting
    // ===================
    formatGroupDates: {
      label: {
        en: 'Format Group Dates',
        ja: 'グループ日付をフォーマット'
      },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Whether to format date values in group headers'
      },
      propertyHelp: {
        tooltip: 'When enabled, date values in group headers will be formatted according to the specified locale.'
      }
      /* wwEditor:end */
    },
    dateLocale: {
      label: {
        en: 'Date Locale',
        ja: '日付ロケール'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'ja-JP',
      options: {
        placeholder: 'e.g., ja-JP, en-US, fr-FR'
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Locale code for date formatting'
      },
      propertyHelp: {
        tooltip: 'The locale to use for date formatting. Examples: ja-JP, en-US, fr-FR.'
      }
      /* wwEditor:end */
    },
    groupPrefix: {
      label: {
        en: 'Group Label Prefix',
        ja: 'グループラベル接頭辞'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: '',
      options: {
        placeholder: 'e.g., 日付:, カテゴリー:'
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Prefix text to add before each group label'
      },
      propertyHelp: {
        tooltip: 'Optional text to display before each group label, such as "日付:" or "カテゴリー:".'
      }
      /* wwEditor:end */
    },

    // ===================
    // Button Configuration
    // ===================
    expandButtonText: {
      label: {
        en: 'Expand Button Text',
        ja: '展開ボタンテキスト'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'すべて展開',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text for the expand all button'
      },
      propertyHelp: {
        tooltip: 'The text displayed on the button that expands all groups.'
      }
      /* wwEditor:end */
    },
    collapseButtonText: {
      label: {
        en: 'Collapse Button Text',
        ja: '折りたたみボタンテキスト'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'すべて折りたたむ',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text for the collapse all button'
      },
      propertyHelp: {
        tooltip: 'The text displayed on the button that collapses all groups.'
      }
      /* wwEditor:end */
    },
    showExpandHint: {
      label: {
        en: 'Show Expand/Collapse Hint',
        ja: '展開/折りたたみヒントを表示'
      },
      type: 'OnOff',
      section: 'settings',
      bindable: true,
      defaultValue: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Whether to show expand/collapse hints on group headers'
      },
      propertyHelp: {
        tooltip: 'When enabled, shows a hint text on each group header indicating it can be clicked to expand or collapse.'
      }
      /* wwEditor:end */
    },
    expandHintText: {
      label: {
        en: 'Expand Hint Text',
        ja: '展開ヒントテキスト'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'クリックして展開',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Hint text for expanding a group'
      },
      propertyHelp: {
        tooltip: 'The hint text shown on collapsed group headers.'
      }
      /* wwEditor:end */
    },
    collapseHintText: {
      label: {
        en: 'Collapse Hint Text',
        ja: '折りたたみヒントテキスト'
      },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'クリックして折りたたむ',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Hint text for collapsing a group'
      },
      propertyHelp: {
        tooltip: 'The hint text shown on expanded group headers.'
      }
      /* wwEditor:end */
    },

    // ===================
    // Styling - Colors
    // ===================
    headerBackgroundColor: {
      label: {
        en: 'Header Background',
        ja: 'ヘッダー背景'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#f3f4f6',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color value for header background'
      },
      propertyHelp: {
        tooltip: 'Background color for the column headers.'
      }
      /* wwEditor:end */
    },
    headerTextColor: {
      label: {
        en: 'Header Text Color',
        ja: 'ヘッダーテキスト色'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#374151',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color value for header text'
      },
      propertyHelp: {
        tooltip: 'Text color for the column headers.'
      }
      /* wwEditor:end */
    },
    groupHeaderBackgroundColor: {
      label: {
        en: 'Group Header Background',
        ja: 'グループヘッダー背景'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#dbeafe',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color value for group header background'
      },
      propertyHelp: {
        tooltip: 'Background color for the group header rows and group cells.'
      }
      /* wwEditor:end */
    },
    groupHeaderTextColor: {
      label: {
        en: 'Group Header Text',
        ja: 'グループヘッダーテキスト'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#1f2937',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color value for group header text'
      },
      propertyHelp: {
        tooltip: 'Text color for the group header rows and group cells.'
      }
      /* wwEditor:end */
    },
    rowBackgroundColor: {
      label: {
        en: 'Row Background',
        ja: '行背景'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#ffffff',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color value for row background'
      },
      propertyHelp: {
        tooltip: 'Background color for the data rows.'
      }
      /* wwEditor:end */
    },
    cellTextColor: {
      label: {
        en: 'Cell Text Color',
        ja: 'セルテキスト色'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#111827',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color value for cell text'
      },
      propertyHelp: {
        tooltip: 'Text color for the data cells.'
      }
      /* wwEditor:end */
    },
    expandButtonColor: {
      label: {
        en: 'Expand Button Color',
        ja: '展開ボタン色'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#3b82f6',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color value for expand button'
      },
      propertyHelp: {
        tooltip: 'Background color for the expand all button.'
      }
      /* wwEditor:end */
    },
    collapseButtonColor: {
      label: {
        en: 'Collapse Button Color',
        ja: '折りたたみボタン色'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#6b7280',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color value for collapse button'
      },
      propertyHelp: {
        tooltip: 'Background color for the collapse all button.'
      }
      /* wwEditor:end */
    },
    countBadgeColor: {
      label: {
        en: 'Count Badge Color',
        ja: 'カウントバッジ色'
      },
      type: 'Color',
      section: 'style',
      bindable: true,
      defaultValue: '#93c5fd',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color value for count badge'
      },
      propertyHelp: {
        tooltip: 'Background color for the count badges in group headers.'
      }
      /* wwEditor:end */
    },

    // ===================
    // Styling - Typography
    // ===================
    fontFamily: {
      label: {
        en: 'Font Family',
        ja: 'フォントファミリー'
      },
      type: 'FontFamily',
      section: 'style',
      bindable: true,
      defaultValue: 'inherit',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Font family for the table'
      },
      propertyHelp: {
        tooltip: 'The font family to use for the entire table.'
      }
      /* wwEditor:end */
    },
    headerFontSize: {
      label: {
        en: 'Header Font Size',
        ja: 'ヘッダーフォントサイズ'
      },
      type: 'Length',
      section: 'style',
      bindable: true,
      options: {
        unitChoices: [{ value: 'px', label: 'px' }, { value: 'rem', label: 'rem' }]
      },
      defaultValue: '12px',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Font size for headers (with unit)'
      },
      propertyHelp: {
        tooltip: 'Font size for the column headers.'
      }
      /* wwEditor:end */
    },
    cellFontSize: {
      label: {
        en: 'Cell Font Size',
        ja: 'セルフォントサイズ'
      },
      type: 'Length',
      section: 'style',
      bindable: true,
      options: {
        unitChoices: [{ value: 'px', label: 'px' }, { value: 'rem', label: 'rem' }]
      },
      defaultValue: '14px',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Font size for cells (with unit)'
      },
      propertyHelp: {
        tooltip: 'Font size for the data cells.'
      }
      /* wwEditor:end */
    },

    // ===================
    // Dropzone Properties (hidden, for custom column content)
    // Columns with useDropzone=true are mapped to these by index
    // ===================
    dropzone_custom_1: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_2: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_3: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_4: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_5: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_6: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_7: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_8: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_9: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_10: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_11: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_12: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_13: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_14: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_15: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_16: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_17: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_18: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_19: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } },
    dropzone_custom_20: { hidden: true, defaultValue: [], navigator: { group: 'Dropzones' } }
  },
  triggerEvents: [
    {
      name: 'expandAll',
      label: {
        en: 'On expand all',
        ja: 'すべて展開時'
      },
      event: {}
    },
    {
      name: 'collapseAll',
      label: {
        en: 'On collapse all',
        ja: 'すべて折りたたみ時'
      },
      event: {}
    },
    {
      name: 'groupToggle',
      label: {
        en: 'On group toggle',
        ja: 'グループ切替時'
      },
      event: {
        groupKey: '',
        isExpanded: false
      }
    },
    {
      name: 'rowClick',
      label: {
        en: 'On row click',
        ja: '行クリック時'
      },
      event: { value: {} }
    }
  ],
  actions: [
    {
      action: 'expandAll',
      label: {
        en: 'Expand all groups',
        ja: 'すべてのグループを展開'
      }
    },
    {
      action: 'collapseAll',
      label: {
        en: 'Collapse all groups',
        ja: 'すべてのグループを折りたたむ'
      }
    }
  ]
};
