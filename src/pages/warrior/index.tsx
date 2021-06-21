import { useRef, useState, useEffect } from 'react';
import { getWarrior, deleteWarrior, getAllBranch } from '@/api/index';
import type { WarriorItem } from '@/api/index';
import { Space, Select, Popconfirm, message, Button } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { EnumWarriorStatus, EnumSex } from '@/enum/index';
import Form from './form';
import utils from '@/utils/util';
type FormQueryType = {
  created?: string[];
  current?: number;
  name?: string;
  phone?: number;
  belong_branch_id?: string;
  pageSize?: number;
  status?: string;
};
export default () => {
  const ref = useRef<ActionType>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [formData, setFormData] = useState<WarriorItem | undefined>();
  const [formMode, setFormMode] = useState<'read' | 'edit'>('edit');
  const [searchFormBranchId, setSearchFormBranchId] = useState('');
  const [branchOptions, setBranchOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [branchMap, setBranchMap] = useState(new Map<string, string>());
  useEffect(() => {
    const map = new Map<string, string>();
    map.set('', '无');
    getAllBranch().then((res) => {
      setBranchOptions([
        ...(res.code == 0
          ? res.data.map((item) => {
              map.set(item.id || item.name, item.name);
              return { label: item.name, value: item.id || '' };
            })
          : []),
        { label: '无', value: '' },
      ]);
      setBranchMap(map);
    });
  }, []);
  const columns: ProColumns<WarriorItem>[] = [
    {
      title: '排序',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'birthday',
      renderFormItem: () => false,
      render: (_, entity) => utils.birthday2Age(entity.birthday),
    },
    {
      title: '性别',
      dataIndex: 'sex',
      renderFormItem: () => false,
      valueEnum: {
        [EnumSex.female]: { text: '女' },
        [EnumSex.male]: { text: '男' },
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      renderFormItem: () => false,
    },
    {
      title: '所属网点',
      dataIndex: 'belong_branch_id',
      render: (_, entity) => branchMap.get(entity.belong_branch_id),
      renderFormItem: () => (
        <Select
          showSearch
          allowClear
          style={{ width: 200 }}
          placeholder="选择所属网点"
          onChange={(value) => setSearchFormBranchId(value as string)}
          options={branchOptions}
          filterOption={(input, option) =>
            (option as { label: string }).label
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      valueEnum: {
        [EnumWarriorStatus.disable]: { text: '禁用', status: 'Default' },
        [EnumWarriorStatus.enable]: { text: '启用', status: 'Success' },
      },
    },
    {
      title: '创建时间',
      width: 140,
      dataIndex: 'created',
      valueType: 'dateTimeRange',
      sorter: (a, b) => a.created - b.created,
      render: (_, entity) => new Date(entity.created).toLocaleString(),
      renderFormItem: () => false,
    },
    {
      title: '操作',
      width: 180,
      key: 'id',
      valueType: 'option',
      render: (id, record: WarriorItem) => [
        <a
          key="link"
          onClick={() => {
            setFormData(record);
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
            const res = await deleteWarrior([record?.id || '']);
            if (res.code != 0) return message.error(res.error);
            message.success('删除成功');
            ref?.current?.reload();
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
    <ProTable<WarriorItem, FormQueryType>
      actionRef={ref}
      columns={columns}
      rowSelection={{}}
      onReset={() => setSearchFormBranchId('')}
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
      tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
        return (
          <Space size={16}>
            <Popconfirm
              key="link3"
              title={`删除选中的${selectedRowKeys.length}条数据?`}
              placement="left"
              onConfirm={async () => {
                const res = await deleteWarrior(selectedRowKeys);
                if (res.code != 0) return message.error(res.error);
                message.success(`${res.data}条删除成功`);
                ref?.current?.reload();
                onCleanSelected();
              }}
              okText="确定"
              cancelText="取消"
            >
              <a>批量删除</a>
            </Popconfirm>
          </Space>
        );
      }}
      request={(params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        return getWarrior({
          page: params.current,
          page_size: params.pageSize,
          name: params.name,
          // phone: params.phone,
          belong_branch_id: searchFormBranchId,
          status: params.status,
          // created_start_time: utils.dateTime2time(params.created?.[0]),
          // created_end_time: utils.dateTime2time(params.created?.[1]),
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
        title: '战士',
      }}
      options={{ fullScreen: true }}
      toolBarRender={() => [
        <Button type="primary" onClick={() => setDrawerVisible(true)}>
          <PlusOutlined />
          新建战士
        </Button>,
        <Form
          mode={formMode}
          visible={drawerVisible}
          initialValues={formData}
          updateVisible={(visible) => {
            setDrawerVisible(visible);
            if (!visible) {
              setFormData(undefined);
              setFormMode('edit');
            }
          }}
          updateTable={() => ref?.current?.reload()}
          branchOptions={branchOptions}
        ></Form>,
      ]}
    />
  );
};
