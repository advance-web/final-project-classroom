import { FaCheckCircle } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import { theme } from 'antd';
import { Popover } from 'antd';
import PropTypes from 'prop-types';

const { useToken } = theme;
const VerifyStatus = ({ verify }) => {
  const { token } = useToken();
  const content = verify ? 'Tài khoản đã kích hoạt thành công' : 'Tài khoản chưa kích hoạt';
  return (
    <Popover title={content}>
      {verify ? <FaCheckCircle color={token.colorSuccess} /> : <MdError color={token.colorError} />}
    </Popover>
  );
};

VerifyStatus.propTypes = {
  verify: PropTypes.bool,
};

export default VerifyStatus;
