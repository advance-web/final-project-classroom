import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import PropTypes from 'prop-types';

import SubMenu from '../../components/shared/subMenu';
import {
  createGradeStructure,
  deleteGradeStructureOfClassroom,
  getAllGradeStructuresOfClassroom,
  updateGradeStructureOfClassroom,
} from '../../services/grade';

import CreateGradeCompositionModal from './components/create-grade-composition-modal';

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
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [createGradeComposition, setCreateGradeComposition] = useState(false);
  const [gradeCompositionName, setGradeCompositionName] = useState('');
  const [scale, setScale] = useState();
  const location = useLocation();

  const idClass = location.pathname.split('/')[2];
  console.log('ID Class: ', idClass);

  useEffect(() => {
    const getAllGradeStructures = async (idClass) => {
      const dataRespond = await getAllGradeStructuresOfClassroom(idClass);
      console.log('Data respond: ', dataRespond);
      setData(dataRespond.data.data);
    };
    getAllGradeStructures(idClass);
  }, []);

  const isEditing = (record) => record._id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      score: '',
      ...record,
    });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        const updatedDataRes = await updateGradeStructureOfClassroom(key, row);
        console.log('Update grade structure: ', updatedDataRes);

        if (updatedDataRes.data.status == 'success') {
          setData(newData);
        }
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

  const handleDelete = async (key) => {
    const newData = data.filter((item) => item._id !== key);

    const deleteDataRes = await deleteGradeStructureOfClassroom(key);
    console.log('Delete grade structure: ', deleteDataRes);
    setData(newData);
  };

  const columns = [
    {
      title: 'Tên cột điểm',
      dataIndex: 'name',
      width: '40%',
      editable: true,
    },
    {
      title: 'Tỉ lệ',
      dataIndex: 'scale',
      width: '20%',
      editable: true,
    },
    {
      title: 'Chỉnh sửa cột điểm',
      dataIndex: 'edit-operation',
      width: '20%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
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
    {
      title: 'Xóa cột điểm',
      dataIndex: 'delete-operation',
      width: '20%',
      render: (_, record) =>
        data.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
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
        inputType: col.dataIndex === 'scale' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleCreateGradeComposition = async () => {
    try {
      const dataCallAPI = {
        name: gradeCompositionName,
        scale: scale,
      };
      console.log('Create grade composition: ', dataCallAPI);
      const dataRespond = await createGradeStructure(idClass, dataCallAPI);
      console.log(dataRespond);

      if (dataRespond.data.status === 'success') {
        const resetData = await getAllGradeStructuresOfClassroom(idClass);
        setData(resetData.data.data);
      }
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