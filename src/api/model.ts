export interface IUploadResponse {
  success_submission_ids: string[]
}
export interface IUploadBody {
  files: File
}
export interface RootObjectDataSubmission {
  id: string
  created_at: string
  updated_at: string
  last_ocr_time: string
  deleted_at: null
  name: string
  status: string
  ocr_error_code: null
  note: null
  reviewing: boolean
  sorted_documents: null
  last_export_time: null
  turnaround_time: null
  validate_time: null
  edit_rate: null
  validated_at: null
  auto_verified: boolean
  upload_source: string
  message_id: null
  folder: string
  validated_by: null
  owner: null
  validator: null
  rejected_by: null
  reviewing_by: null
  documents_count: number
  files_count: number
  unclassified_pages_count: number
  unclassified_files: Unclassifiedfile[]
  documents: Document[]
  files: File[]
  pages_count: number
}

interface File {
  id: string
  created_at: string
  updated_at: string
  deleted_at: null
  name: string
  path: string
  extension: string
  mime_type: null
  thumbnail_path: null
  size: number
  input_email: null
  submission: string
  org: string
}

interface Document {
  id: null
  page_set: string[]
  submission: string
  data_set: any
}

interface Unclassifiedfile {
  id: string
  name: string
  page: string
  page_index: number
}
export interface IBill {
  nbmst: string
  khhdon_first: string
  khhdon_last: string
  shdon: string
  tgtttbso: string
}
export interface IBillMessageError {
  nbmst?: string
  khhdon_first?: string
  khhdon_last?: string
  shdon?: string
  tgtttbso?: string
}
export interface IBillConfidenceScore {
  nbmst: number
  khhdon: number
  shdon: number
  tgtttbso: number
}

export interface IRootBillObject {
  hddt: Hddt
  nnt: Nnt[]
  description: string
}

interface Nnt {
  key: string
  value: string
}

interface Hddt {
  code: number
  status?: number
}
