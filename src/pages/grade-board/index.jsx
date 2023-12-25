import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Input, Table } from 'antd';
import PropTypes from 'prop-types';

import SubMenu from '../../components/shared/subMenu';
import { getAllGradeStructuresOfClassroom, getAllGradeStudentsOfClassroom } from '../../services/grade';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  console.log('Index: ', index);
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

function GradeBoard() {
  const [listGradeComposition, setListGradeComposition] = useState();
  const [dataSource, setDataSource] = useState();
  const location = useLocation();

  const idClass = location.pathname.split('/')[2];
  console.log('ID Class: ', idClass);

  useEffect(() => {
    const getAllGradeStructures = async (idClass) => {
      const dataRespond = await getAllGradeStructuresOfClassroom(idClass);
      const gradeDataRespond = dataRespond.data.data;
      //console.log('Data respond: ', gradeDataRespond);
      const gradeColumns = gradeDataRespond?.map((item) => ({
        title: item.name + ' (' + item.scale + ')',
        dataIndex: item._id,
        editable: true,
      }));
      //console.log('List gradeColumns: ', gradeColumns);
      const dataColumns = [...defaultColumns, ...gradeColumns];
      //console.log('List gradeColumns: ', dataColumns);
      setListGradeComposition(dataColumns);
      //console.log('List columns: ', listGradeComposition);
    };
    getAllGradeStructures(idClass);
  }, [idClass]);

  useEffect(() => {
    const getAllGradeStudents = async (idClass) => {
      const dataRespond = await getAllGradeStudentsOfClassroom(idClass);
      console.log('Grade student: ', dataRespond.data.data);
      const gradeStudents = dataRespond.data.data;
      const transformedData = gradeStudents.map((item) => {
        const { studentInfo, grades } = item;
        const resultItem = {
          key: studentInfo._id,
          name: studentInfo.name,
        };

        listGradeComposition?.forEach((column) => {
          if (column.dataIndex !== 'name') {
            resultItem[column.dataIndex] = '_';
          }
        });

        grades.forEach((gradeItem) => {
          const columnIndex = listGradeComposition?.findIndex(
            (column) => column.dataIndex === gradeItem.structureGrade
          );
          if (columnIndex > -1) {
            resultItem[`${gradeItem.structureGrade}`] = gradeItem.grade;
          }
        });

        return resultItem;
      });
      console.log('Data transform', transformedData);
      setDataSource(transformedData);
    };
    getAllGradeStudents(idClass);
  }, [idClass, listGradeComposition]);

  const defaultColumns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      width: '30%',
    },
  ];
  console.log('List columns: ', listGradeComposition);

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = listGradeComposition?.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  return (
    <div>
      <SubMenu></SubMenu>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
}

export default GradeBoard;

EditableCell.propTypes = {
  title: PropTypes.string,
  editable: PropTypes.bool,
  children: PropTypes.node,
  dataIndex: PropTypes.string,
  record: PropTypes.object,
  handleSave: PropTypes.func,
  restProps: PropTypes.object,
};
