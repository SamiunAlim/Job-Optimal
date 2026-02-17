import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3081/api`;

export const register = (userData) => axios.post(`${API_URL}/auth/register`, userData);
export const login = (userData) => axios.post(`${API_URL}/auth/login`, userData);
export const getJobs = () => axios.get(`${API_URL}/jobs/all`);
export const postJob = (jobData, token) => axios.post(`${API_URL}/jobs/post`, jobData, {
    headers: { Authorization: `Bearer ${token}` }
});
export const getCandidateProfile = (userId) => axios.get(`${API_URL}/profile/candidate/${userId}`);
export const getProfile = (userId) => axios.get(`${API_URL}/profile/${userId}`);
export const updateProfile = (data) => axios.put(`${API_URL}/profile/update`, data);
export const saveAssessmentScore = (data) => axios.post(`${API_URL}/assessments/save`, data);
export const uploadResume = (formData) => axios.post(`${API_URL}/resume/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const aiChat = (message) => axios.post(`${API_URL}/ai/chat`, { message });
export const aiSmartMatch = (resumeText, jobDescription) => axios.post(`${API_URL}/ai/smart-match`, { resumeText, jobDescription });
