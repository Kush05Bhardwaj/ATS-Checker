// src/utils/api.js
import axios from 'axios'

const BASE_URL = '/api'

export async function analyzeResume({ file, jobDescription, useAI, expLevel = 'mid', pages = 1 }) {
  const formData = new FormData()
  formData.append('resume', file)
  formData.append('job_description', jobDescription)
  formData.append('use_ai_suggestions', useAI ? 'true' : 'false')
  formData.append('experience_level', expLevel)
  formData.append('resume_pages', String(pages))

  const response = await axios.post(`${BASE_URL}/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  })

  return response.data
}