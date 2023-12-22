import { useState } from 'react';
import { Button, Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import PropTypes from 'prop-types';

import SubMenu from '../../components/shared/subMenu';

import CreateGradeCompositionModal from './components/create-grade-composition-modal';

const originData = [
  {
    key: '1',
    title: 'Giữa kì',
    score: 50,
  },
  {
    key: '2',
    title: 'Cuối kì',
    score: 50,
  },
];

const EditableCell = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function GradeStructure() {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const [createGradeComposition, setCreateGradeComposition] = useState(false);
  const [gradeCompositionName, setGradeCompositionName] = useState('');
  const [scale, setScale] = useState();

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      score: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Tên cột điểm',
      dataIndex: 'title',
      width: '40%',
      editable: true,
    },
    {
      title: 'Tỉ lệ',
      dataIndex: 'score',
      width: '30%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width: '30%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'score' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleCreateGradeComposition = async () => {
    try {
      //to do
      setData([
        ...data,
        {
          key: '3',
          title: gradeCompositionName,
          score: scale,
        },
      ]);
      console.log('Create grade composition: ' + gradeCompositionName + ' ' + scale);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <SubMenu></SubMenu>
      <div>
        <Button onClick={() => setCreateGradeComposition(true)}>+ Thêm cột điểm thành phần</Button>
        <CreateGradeCompositionModal
          open={createGradeComposition}
          onCancel={() => setCreateGradeComposition(false)}
          onOk={handleCreateGradeComposition}
          onInputGradeCompositionNameChange={(value) => setGradeCompositionName(value)}
          onInputScaleChange={(value) => setScale(value)}
        />
      </div>
      <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={false}
          />
        </Form>
      </div>
    </div>
  );
}

EditableCell.propTypes = {
  editing: PropTypes.bool,
  dataIndex: PropTypes.string,
  title: PropTypes.string,
  inputType: PropTypes.string,
  children: PropTypes.node,
  restProps: PropTypes.object,
};
