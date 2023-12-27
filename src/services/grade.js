import request from '../libs/utils/axios';

const CREATE_GRADE_STRUCTURE_ENDPOINT = '/teachers/new-structureGrade/';
const GET_ALL_GRADE_STRUCTURES_ENDPOINT = (idClass) => `/classroom/${idClass}/structureGrade`;
const UPDATE_GRADE_STRUCTURES_ENDPOINT = (idComposition) => `/structureGrade/${idComposition}`;
const DELETE_GRADE_STRUCTURES_ENDPOINT = (idComposition) => `/structureGrade/${idComposition}`;
const GET_ALL_GRADE_STUDENTS_ENDPOINT = (idClass) => `/classroom/${idClass}/studentGrade`;
const GET_ALL_GRADE_REVIEW_ENDPOINT = (idClass) => `/classroom/${idClass}/gradeReview`;

// Grade
const GET_STUDENT_GRADE_ENDPOINT = '/students/grade/';
const GET_STRUCTURE_GRADE_ENDPOINT = (idClass) => `/classroom/${idClass}/structureGrade`;
const GET_ALL_STUDENT_GRADE_IN_ENDPOINT = (idClass) => `/classroom/${idClass}/studentGrade`;

// ReviewComment
const REVIEW_GRADE_ENDPOINT = '/gradeReview/';

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

export const getStudentGrade = (classroomId) => {
  return request.get(GET_STUDENT_GRADE_ENDPOINT + classroomId);
};

export const getStructureGrade = (idClass) => {
  return request.get(GET_STRUCTURE_GRADE_ENDPOINT(idClass));
};

export const getAllStudentGradeInClassroom = (idClass) => {
  return request.get(GET_ALL_STUDENT_GRADE_IN_ENDPOINT(idClass));
};

// ReviewComment
export const postGradeReview = (data) => {
  return request.post(REVIEW_GRADE_ENDPOINT, data);
};

export const getReviewDetail = (reviewId) => {
  return request.get(REVIEW_GRADE_ENDPOINT + reviewId);
};

export const postComment = (reviewId, data) => {
  return request.post(REVIEW_GRADE_ENDPOINT + reviewId + '/comments', data);
};
