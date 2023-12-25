import request from '../libs/utils/axios';

const CREATE_GRADE_STRUCTURE_ENDPOINT = '/teachers/new-structureGrade/';
const GET_ALL_GRADE_STRUCTURES_ENDPOINT = (idClass) => `/classroom/${idClass}/structureGrade`;
const UPDATE_GRADE_STRUCTURES_ENDPOINT = (idComposition) => `/structureGrade/${idComposition}`;
const DELETE_GRADE_STRUCTURES_ENDPOINT = (idComposition) => `/structureGrade/${idComposition}`;
const GET_ALL_GRADE_STUDENTS_ENDPOINT = (idClass) => `/classroom/${idClass}/studentGrade`;
const GET_ALL_GRADE_REVIEW_ENDPOINT = (idClass) => `/classroom/${idClass}/gradeReview`;

export const createGradeStructure = (idClass, data) => {
  return request.post(CREATE_GRADE_STRUCTURE_ENDPOINT + idClass, data);
};

export const getAllGradeStructuresOfClassroom = (idClass) => {
  return request.get(GET_ALL_GRADE_STRUCTURES_ENDPOINT(idClass));
};

export const getAllGradeStudentsOfClassroom = (idClass) => {
  return request.get(GET_ALL_GRADE_STUDENTS_ENDPOINT(idClass));
};

export const updateGradeStructureOfClassroom = (idComposition, data) => {
  return request.patch(UPDATE_GRADE_STRUCTURES_ENDPOINT(idComposition), data);
};

export const deleteGradeStructureOfClassroom = (idComposition) => {
  return request.delete(DELETE_GRADE_STRUCTURES_ENDPOINT(idComposition));
};

export const getAllGradeReviewsOfClassroom = (idClass) => {
  return request.get(GET_ALL_GRADE_REVIEW_ENDPOINT(idClass));
};
