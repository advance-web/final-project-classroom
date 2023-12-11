import request from '../libs/utils/axios';

const CREATE_CLASSROOM_ENDPOINT = '/teachers/new-classroom';
const GET_MY_CLASSROOM_ENDPOINT = '/users/me/classrooms';
const GET_DETAIL_CLASSROOM_ENDPOINT = '/classroom/';
const GET_CLASSROOM_PARTICIPANT_ENDPOINT = '/participants';

export const createClassroom = (data) => {
  return request.post(CREATE_CLASSROOM_ENDPOINT, data);
};

export const getMyClassroom = () => {
  return request.get(GET_MY_CLASSROOM_ENDPOINT);
};

export const getDetailClassroomById = (idClass) => {
  return request.get(GET_DETAIL_CLASSROOM_ENDPOINT + idClass);
};

export const getClassroomParticipant = (idClass) => {
  return request.get(GET_DETAIL_CLASSROOM_ENDPOINT + idClass + GET_CLASSROOM_PARTICIPANT_ENDPOINT);
};
