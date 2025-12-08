export interface CertificateData {
  id: string;
  userId: string;
  courseId: string;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  finalScore: number;
  certificateId: string;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateTemplateProps {
  studentName: string;
  courseTitle: string;
  issueDate: string;
  finalScore: number;
  certificateId: string;
}

export interface CertificateEligibility {
  isEligible: boolean;
  requirements: {
    completionRate: number;
    quizzesPassed: boolean;
    paymentVerified: boolean;
  };
  missingRequirements: string[];
}