import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Form, Input, Table } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ExcelExportButton from '../../components/shared/exportToExcel';
import SubMenu from '../../components/shared/subMenu';
import {
  createAndUpdateGrade,
  finalizeStructureGrade,
  getAllGradeStructuresOfClassroom,
  getAllGradeStudentsOfClassroom,
} from '../../services/grade';
import { createAndUpdateIdMappingByTeacher, notifyAllStudentInClassroom } from '../../services/notification';

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
      handleSave(
        {
          ...record,
          ...values,
        },
        dataIndex
      );
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
      console.log('Data respond: ', gradeDataRespond);
      const gradeColumns = gradeDataRespond?.map((item) => ({
        // title: item.name + ' (' + item.scale + ')',
        title: () => (
          <>
            {item.name} ({item.scale}){' '}
            <Button type="primary" danger onClick={() => handleFinalize(item?.id)} disabled={item?.isFinalize}>
              {/* <a href="">Finalize</a> */}
              Finalize
            </Button>
          </>
        ),
        dataIndex: item._id,
        editable: !item?.isFinalize,
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
          idMapping: studentInfo.idMapping,
        };

        listGradeComposition?.forEach((column) => {
          if (column.dataIndex !== 'name') {
            if (column.dataIndex !== 'idMapping') {
              resultItem[column.dataIndex] = '_';
            } else {
              if (studentInfo.idMapping === undefined) {
                resultItem[column.dataIndex] = '_';
              }
            }
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
      width: '20%',
    },
    {
      title: 'Mã số sinh viên',
      dataIndex: 'idMapping',
      width: '15%',
      editable: true,
    },
  ];
  console.log('List columns: ', listGradeComposition);

  const handleSave = async (row, dataIndexChange) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log('Row', row);

    if (dataIndexChange == 'idMapping') {
      const updatedIdMapping = {
        id: row[dataIndexChange],
      };

      const idUser = row.key;
      console.log(updatedIdMapping);

      const updatedIdMappingRes = await createAndUpdateIdMappingByTeacher(idUser, updatedIdMapping);
      console.log('Mapping respond: ', updatedIdMappingRes);
      if (updatedIdMappingRes.data.status == 'success') {
        setDataSource(newData);
      }
    } else {
      const dataUpdatedGrade = {
        student: row.key,
        structureGrade: dataIndexChange,
        grade: row[dataIndexChange],
      };
      console.log('Data update grade: ', dataUpdatedGrade);
      const updatedGradeRes = await createAndUpdateGrade(dataUpdatedGrade);
      console.log('Data response: ', updatedGradeRes);
      if (updatedGradeRes.data.status == 'success') {
        setDataSource(newData);
      }
    }
  };

  const handleFinalize = async (gradeStructureId) => {
    try {
      const isFinalizeData = {
        isFinalize: true,
      };
      const responseFinalizeStructureGrade = await finalizeStructureGrade(gradeStructureId, isFinalizeData);
      console.log(responseFinalizeStructureGrade);

      if (responseFinalizeStructureGrade.data.status === 'success') {
        // Notify call API
        const data = {
          type: 'FINALIZE_GRADE',
          redirect: `/classroom/${idClass}/studentGrade`,
        };
        const result = await notifyAllStudentInClassroom(idClass, data);
        console.log('Response sau khi call API notify:', result);

        // set lại state
        setListGradeComposition((prev) => {
          return prev.map((item) => {
            if (item?.dataIndex === responseFinalizeStructureGrade?.data?.data?.id) {
              return { ...item, editable: false };
            }
            return item;
          });
        });
      }
    } catch (error) {
      console.log('Lỗi: ', error);
    }
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

  const gradeBoardExportExcel = dataSource?.map((item) => {
    const newItem = {};
    columns?.forEach((column) => {
      newItem[column.title] = item[column.dataIndex];
    });
    return newItem;
  });
  console.log('gradeBoardExportExcel: ', gradeBoardExportExcel);

  const gradeBoardHasNoGradeExportExcel = dataSource?.map((item) => {
    const newItem = {};
    columns?.forEach((column) => {
      if (column.dataIndex == 'name') {
        newItem[column.title] = item[column.dataIndex];
      } else {
        newItem[column.title] = '';
      }
    });
    return newItem;
  });

  console.log('gradeBoardHasNoGradeExportExcel: ', gradeBoardHasNoGradeExportExcel);

  return (
    <div>
      <SubMenu></SubMenu>
      <CSSExcelExportButton>
        <ExcelExportButton
          data={gradeBoardHasNoGradeExportExcel}
          fileName="Template_BangDiem"
          sheetName="Data"
          buttonName="Xuất bảng điểm mẫu (.xlsx)"
        />
      </CSSExcelExportButton>
      <CSSExcelExportButton>
        <ExcelExportButton
          data={gradeBoardExportExcel}
          fileName="BangDiem"
          sheetName="Data"
          buttonName="Xuất bảng điểm chính thức (.xlsx)"
        />
      </CSSExcelExportButton>
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

const CSSExcelExportButton = styled.div`
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

EditableCell.propTypes = {
  title: PropTypes.func,
  editable: PropTypes.bool,
  children: PropTypes.node,
  dataIndex: PropTypes.string,
  record: PropTypes.object,
  handleSave: PropTypes.func,
  restProps: PropTypes.object,
};

EditableRow.propTypes = {
  index: PropTypes.string,
  props: PropTypes.object,
};
