import request from '../libs/utils/axios';

const INVITE_CLASSROOM_ENDPOINT = '/teachers/classroom-invite';

export const inviteClassroom = (data) => {
  return request.post(INVITE_CLASSROOM_ENDPOINT, data);
};
