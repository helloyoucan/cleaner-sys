import styles from './index.less';
import { useRef, useState } from 'react';
import { getBranch, deleteBranch } from '@/api/index';
import type { BranchItem } from '@/api/index';
import cityOptions from './city';
import {
  Button,
  Tooltip,
  Input,
  Space,
  Table,
  Cascader,
  Popconfirm,
  message,
} from 'antd';
import type { FormInstance } from 'antd';
import { QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import Form from './form';

export default () => {
  const ref = useRef<FormInstance>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [formData, setFormData] = useState<BranchItem | undefined>();
  const [formMode, setFormMode] = useState<'read' | 'edit'>('edit');
  const columns: ProColumns<BranchItem>[] = [
    {
      title: '排序',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '网店点名称',
      dataIndex: 'name',
    },
    {
      title: '地区',
      dataIndex: 'address',
      render: (_, record: BranchItem) => {
        const { province, city, area, address } = record;
        return `${province || '-'}/${city || '-'}/${area || '-'}/${
          address || '-'
        }`;
      },
      renderFormItem: (_, { onChange, value }, form) => {
        return (
          <Cascader
            options={cityOptions}
            onChange={onChange}
            value={value}
            placeholder="选择地区"
          />
        );
      },
    },
    {
      title: '负责人',
      dataIndex: 'contact_person',
    },
    {
      title: '联系方式',
      dataIndex: 'contact_phone',
      renderFormItem: () => false,
    },
    {
      title: '服务范围',
      dataIndex: 'range',
      render: (_) => _ + '米',
      renderFormItem: () => false,
    },
    {
      title: '基础费用',
      dataIndex: 'base_cost',
      render: (_) => _ + '元',
      renderFormItem: () => false,
    },
    {
      title: '超出范围的单价',
      dataIndex: 'extra_range_unit_price',
      render: (_) => _ + '元/km',
      renderFormItem: () => false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      initialValue: 1,
      filters: true,
      onFilter: true,
      valueEnum: {
        1: { text: '营业中', status: 'Default' },
        2: { text: '休息中', status: 'Default' },
        3: { text: '关闭', status: 'Processing' },
      },
    },
    {
      title: '创建时间',
      width: 140,
      dataIndex: 'created',
      valueType: 'date',
      sorter: (a, b) => a.created - b.created,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      // copyable: true,
      renderFormItem: () => false,
    },
    {
      title: '操作',
      width: 180,
      key: 'id',
      valueType: 'option',
      render: (id, record: BranchItem) => [
        <a
          key="link"
          onClick={() => {
            setFormMode('read');
            setDrawerVisible(true);
          }}
        >
          查看
        </a>,
        <a
          key="link2"
          onClick={() => {
            setFormData(record);
            setDrawerVisible(true);
          }}
        >
          修改
        </a>,
        <Popconfirm
          key="link3"
          title="删除这条数据?"
          placement="left"
          onConfirm={async () => {
            const res = await deleteBranch(id as string);
            if (res.code != 0) return message.error(res.error);
            message.success('删除成功');
            ref?.current?.submit();
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <ProTable<BranchItem>
      formRef={ref}
      columns={columns}
      rowSelection={{}}
      tableAlertRender={({
        selectedRowKeys,
        selectedRows,
        onCleanSelected,
      }) => (
        <Space size={24}>
          <span>
            已选 {selectedRowKeys.length} 项
            <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
              取消选择
            </a>
          </span>
        </Space>
      )}
      tableAlertOptionRender={() => {
        return (
          <Space size={16}>
            <a>批量删除</a>
          </Space>
        );
      }}
      request={(params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        return getBranch({
          page: params.current,
          page_size: params.pageSize,
        }).then((res) => {
          if (res.code != 0) {
            return {
              data: [],
              success: false,
            };
          }
          return {
            data: res.data?.list,
            success: true,
            total: res.data.pages.total,
          };
        });
      }}
      rowKey="id"
      pagination={{
        showQuickJumper: true,
        pageSize: 10,
      }}
      search={{
        defaultCollapsed: true,
      }}
      dateFormatter="string"
      toolbar={{
        title: '网点',
      }}
      options={{ fullScreen: true }}
      toolBarRender={() => [
        <Form
          mode={formMode}
          visible={drawerVisible}
          initialValues={formData}
          updateVisible={(visible) => {
            setDrawerVisible(visible);
            !visible && setFormMode('edit');
          }}
          updateTable={() => ref?.current?.submit()}
        ></Form>,
      ]}
    />
  );
};
