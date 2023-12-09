import { Card, Typography } from 'antd';

export default function CardClassroomInfo(props) {
  const data = props.data;
  return (
    <div>
      <Card
        title={data.classroomName}
        bordered={false}
        style={{
          width: 300,
        }}
      >
        <Typography.Paragraph>{data.subject}</Typography.Paragraph>
        <Typography.Paragraph>{data.teacher}</Typography.Paragraph>
        <Typography.Paragraph>{data.description}</Typography.Paragraph>
      </Card>
    </div>
  );
}

CardClassroomInfo.propTypes = {
  data: Object,
};
