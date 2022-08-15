export default function form() {
  return [
    {
      type: 'radio',
      field: 'labelPosition',
      value: 'right',
      title: '标签位置',
      options: [
        {
          value: 'right',
          label: 'right'
        },
        {
          value: 'left',
          label: 'left'
        },
        {
          value: 'top',
          label: 'top'
        }
      ]
    },
    {
      type: 'radio',
      field: 'size',
      value: 'default',
      title: '表单尺寸',
      options: [
        {
          value: 'small',
          label: 'small'
        },
        {
          value: 'large',
          label: 'large'
        },
        {
          value: 'default',
          label: 'default'
        }
      ]
    },
    {
      type: 'input',
      field: 'labelWidth',
      value: '125px',
      title: '标签宽度'
    },
    {
      type: 'switch',
      field: 'hideRequiredAsterisk',
      value: false,
      title: '隐藏必填字段的标签旁边的红色星号'
    },
    {
      type: 'switch',
      field: 'showMessage',
      value: true,
      title: '显示校验错误信息'
    },
    {
      type: 'switch',
      field: 'inlineMessage',
      value: false,
      title: '以行内形式展示校验信息'
    },
    {
      type: 'switch',
      field: 'formCreateSubmitBtn',
      value: true,
      title: '是否显示表单提交按钮'
    },
    {
      type: 'switch',
      field: 'formCreateResetBtn',
      value: false,
      title: '是否显示表单重置按钮'
    }
  ]
}
