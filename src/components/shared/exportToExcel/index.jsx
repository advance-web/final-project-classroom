import { Button } from 'antd';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';

const ExcelExportButton = ({ data, fileName, sheetName, buttonName }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Sheet1');
    XLSX.writeFile(workbook, `${fileName || 'ExportedData'}.xlsx`);
  };

  return (
    <Button type="primary" onClick={exportToExcel}>
      {buttonName}
    </Button>
  );
};

export default ExcelExportButton;

ExcelExportButton.propTypes = {
  data: PropTypes.object,
  fileName: PropTypes.string,
  sheetName: PropTypes.string,
  buttonName: PropTypes.string,
};
