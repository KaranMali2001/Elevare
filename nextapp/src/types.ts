type Mail = {
  id: string;
  threadId: string;
  labels: string[];
  textPlain: string;
  textHtml: string;
  date: Date;
  from: string;
  to: string;
  snippet: string;
  subject: string;
  shortSummary?: string;
  longSummary?: string;
  tone?: string;
  body?: string;
};
type Notifications = {
  id: number;
  title: string;
  description: string;
  isRead: boolean;
};

type DashBoardEmail = {
  id: string;
  threadId: string;
  contentType?: string;
  shortSummary: string;
  longSummary: string;
  tone: string;
  date: Date;
  from: string;
  subject: string;
  labels: string[];
  category?: string;
  sentiment?: string;
  vectorEmbeddings?: number[];
};

type ThreadReqBody = {
  thread_id: string;
  previous_conversation_summary?: string;
  latest_thread_conversation: {
    latest_sender_name: string;
    latest_body: string;
  };
};
type DBEmail = {
  id: string;
  threadId?: string | null;
  contentType?: string | null;
  shortSummary?: string | null;
  longSummary?: string | null;
  tone?: string | null;
  cc?: string | null;
  bcc?: string | null;
  date?: string | null;
  from?: string | null;
  subject?: string | null;
  label: string[];
  userEmailAddress: string;
  // replies: [];
};
type SkippedMail = {
  id: string;
  threadId: string;
  contentType?: string;
  shortSummary: string;
  longSummary: string;
  tone: string;
  date: Date;
  from: string;
  subject: string;
  labels: string[];
  category?: string;
};

type batchOfEmailsReqBody = {
  mail_id: string;
  subject: string;
  body: string;
  sender: string;
};
type finalbatchOfEmailsReqBody = {
  emails: batchOfEmailsReqBody[];
  username: string;
  categories: string[];
};
//changing naming convention by asking chinmay
type batchOfEmailsResBody = {
  mail_id: string;
  short_summary: string;
  summary: string;
  tone: string;
  category: string;
  sentiment: string;
  vectorEmbeddings: number[];
};
type EmailFullFormat = {
  id: string;
  threadId: string;
  labels: string[];
  snippet: string;
  date: Date;
  from: string;
  to: string;
  subject: string;
  textPlain: string;
  textHtml: string;
  body: string;
};
type SendEmail = {
  id: string; //this is id of newly generated mail
  replyMailId: string;
  threadId: string;
  idOfOriginalMail: string;
  generatedSubject: string;
  generatedResponse: string;
  generatedTimeStamp: string;
  userEmailAddress: string;
  to: string; //sender in our ReplyEmailFormat type
  cc: string;
  bcc: string;
  user: string;
  labels: string[];
  category: string;
  emails: string;
  userFilesId: string;
};

type generatedResponse = GenReqBody | ComposeReqBodyForLLM;
type ComposeReqBodyForLLM = {
  username: string; //userEmailAddress
  custom_knowledge: boolean;
  data: {
    mail_id?: string; //can skip

    sender: string; //same as username
    receiver: string; //whom we are sending
    response: string; //prompt
    response_tone?: string;
    response_writing_style?: string;
    length?: string;
    compose_language?: string;
  };
};
type GenReqBody = {
  username: string;
  custom_knowledge: boolean;
  data: {
    length: string;
    previous_subject: string; //orinal mail subject
    previous_body: string; //long summery or mail body
    sender: string; //Mail Object-> from

    response: string; //prompt

    response_writing_style: string;

    compose_language: string;

    response_tone: string;
  };
};

type ReturnEmailType = {
  id: string;
  threadId: string;
  sender: string;
  contentType: string;
  date: string;
  subject: string;
  textPlain: string;
};
type ReplyEmailDBFormat = {
  replyMailId: string;
  threadId: string;
  idOfOriginalMail: string;
  generatedSubject: string;
  generatedResponse: string;
  generatedTimeStamp: string;
  userEmailAddress: string;
  to: string; //sender in our ReplyEmailFormat type
  cc?: string;
  bcc?: string;
  labels?: string[];
  category?: string;
  userFilesId?: string;
};
type ReplyEmailFormat = {
  id: string;
  threadId: string;
  sender: string;
  contentType?: string;
  body: string;
  subject: string;
};
