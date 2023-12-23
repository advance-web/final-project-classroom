import request from '../libs/utils/axios';

const CREATE_GRADE_STRUCTURE_ENDPOINT = '/teachers/new-structureGrade/';
const GET_ALL_GRADE_STRUCTURES_ENDPOINT = (idClass) => `/classroom/${idClass}/structureGrade`;

export const createGradeStructure = (idClass, data) => {
  return request.post(CREATE_GRADE_STRUCTURE_ENDPOINT + idClass, data);
};

export const getAllGradeStructuresOfClassroom = (idClass) => {
  return request.get(GET_ALL_GRADE_STRUCTURES_ENDPOINT(idClass));
};
