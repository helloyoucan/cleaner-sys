import styles from './index.less';
import { getBranch } from '@/api/index';
import cityOptions from './city';
import { Button, Tooltip, Input, Space, Table, Cascader } from 'antd';
import { QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import Form from './form';
type TableListItem = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  province: string;
  city: string;
  area: string;
  address: string;
  contact_person: string;
  contact_phone: number;
  warrior_manager_id: string;
  range: number;
  base_cost: number;
  extra_range_unit_price: number;
  status: number;
  remark: string;
  created: number;
};
const tableListDataSource: TableListItem[] = [];
const columns: ProColumns<TableListItem>[] = [
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
    render: (dom, entity: any) => {
      const { province, city, area, address } = entity;
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
    copyable: true,
    renderFormItem: () => false,
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: () => [
      <a key="link">查看</a>,
      <a key="link2">修改</a>,
      <a key="link3">删除</a>,
    ],
  },
];

export default () => {
  return (
    <ProTable<TableListItem>
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
        console.log(params, sorter, filter);
        return getBranch({ page: 1, page_size: 5 }).then((res: any) => {
          console.log(res);
          return {
            data: res.data.list,
            success: true,
          };
        });
        // return Promise.resolve({
        //   data: tableListDataSource,
        //   success: true,
        // });
      }}
      rowKey="id"
      pagination={{
        showQuickJumper: true,
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
        <Form></Form>,
        // <Button type="primary" key="primary">
        //   创建应用
        // </Button>,
      ]}
    />
  );
};
