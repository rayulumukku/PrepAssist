// Route key -> the file that renders it. FROZEN: implementers replace the placeholder FILES; they never
// edit this map. Paths and owners are listed in mobile/OWNERSHIP.json.
import AccountScreen from '../screens/account/AccountScreen';
import LegalScreen from '../screens/account/LegalScreen';
import OnestepScreen from '../screens/account/OnestepScreen';
import PaymentsScreen from '../screens/account/PaymentsScreen';
import PlanMagicOverlay from '../screens/account/PlanMagicOverlay';
import SettingsScreen from '../screens/account/SettingsScreen';
import StatusScreen from '../screens/account/StatusScreen';
import UpgradeScreen from '../screens/account/UpgradeScreen';
import WalletScreen from '../screens/account/WalletScreen';
import AuthStage from '../screens/arrival/AuthStage';
import BookStage from '../screens/arrival/BookStage';
import IntroStage from '../screens/arrival/IntroStage';
import VerifyStage from '../screens/arrival/VerifyStage';
import CloudScreen from '../screens/library/CloudScreen';
import FolderScreen from '../screens/library/FolderScreen';
import Note2Screen from '../screens/library/Note2Screen';
import NoteshubScreen from '../screens/library/NoteshubScreen';
import NotesysScreen from '../screens/library/NotesysScreen';
import NtNoteScreen from '../screens/library/NtNoteScreen';
import QuerydbScreen from '../screens/library/QuerydbScreen';
import SyllabusScreen from '../screens/library/SyllabusScreen';
import TrackerScreen from '../screens/library/TrackerScreen';
import UploadScreen from '../screens/library/UploadScreen';
import XrayhomeScreen from '../screens/library/XrayhomeScreen';
import XrayScreen from '../screens/library/XrayScreen';
import AnswerbankScreen from '../screens/practice/AnswerbankScreen';
import AnswerScreen from '../screens/practice/AnswerScreen';
import EngineScreen from '../screens/practice/EngineScreen';
import HistoryScreen from '../screens/practice/HistoryScreen';
import MainsResultScreen from '../screens/practice/MainsResultScreen';
import MainsScreen from '../screens/practice/MainsScreen';
import PastevalsScreen from '../screens/practice/PastevalsScreen';
import PqbScreen from '../screens/practice/PqbScreen';
import QbankScreen from '../screens/practice/QbankScreen';
import QuizScreen from '../screens/practice/QuizScreen';
import TestquizScreen from '../screens/practice/TestquizScreen';
import TestsScreen from '../screens/practice/TestsScreen';
import ArticleScreen from '../screens/study/ArticleScreen';
import CalendarScreen from '../screens/study/CalendarScreen';
import CourseScreen from '../screens/study/CourseScreen';
import CoursesScreen from '../screens/study/CoursesScreen';
import LessonScreen from '../screens/study/LessonScreen';
import MindmapScreen from '../screens/study/MindmapScreen';
import MindmapsScreen from '../screens/study/MindmapsScreen';
import NoteScreen from '../screens/study/NoteScreen';
import PlanScreen from '../screens/study/PlanScreen';
import SavedScreen from '../screens/study/SavedScreen';
import CurrentTab from '../screens/tabs/CurrentTab';
import HomeTab from '../screens/tabs/HomeTab';
import LearnTab from '../screens/tabs/LearnTab';
import MenuTab from '../screens/tabs/MenuTab';
import PracticeTab from '../screens/tabs/PracticeTab';
import ProfileTab from '../screens/tabs/ProfileTab';
import ReelViewerOverlay from '../screens/tabs/ReelViewerOverlay';
import AccountSheet from '../sheets/account/AccountSheet';
import CreditsSheet from '../sheets/account/CreditsSheet';
import DelAskSheet from '../sheets/account/DelAskSheet';
import LanguageSheet from '../sheets/account/LanguageSheet';
import LedgerSheet from '../sheets/account/LedgerSheet';
import LowCreditsSheet from '../sheets/account/LowCreditsSheet';
import PaymentsSheet from '../sheets/account/PaymentsSheet';
import PrefsSheet from '../sheets/account/PrefsSheet';
import PrivacySheet from '../sheets/account/PrivacySheet';
import PurchaseSheet from '../sheets/account/PurchaseSheet';
import SettingsSheet from '../sheets/account/SettingsSheet';
import SubscriptionSheet from '../sheets/account/SubscriptionSheet';
import ChangeEmailSheet from '../sheets/arrival/ChangeEmailSheet';
import ForgotSheet from '../sheets/arrival/ForgotSheet';
import CloudDeleteSheet from '../sheets/library/CloudDeleteSheet';
import NoteNewSheet from '../sheets/library/NoteNewSheet';
import NoteUpdatesSheet from '../sheets/library/NoteUpdatesSheet';
import SyllabusFilterSheet from '../sheets/library/SyllabusFilterSheet';
import SyllabusTopicSheet from '../sheets/library/SyllabusTopicSheet';
import TrackerInboxSheet from '../sheets/library/TrackerInboxSheet';
import TrackerNewFolderSheet from '../sheets/library/TrackerNewFolderSheet';
import TrackerOptionalSheet from '../sheets/library/TrackerOptionalSheet';
import TrackerSplitPdfSheet from '../sheets/library/TrackerSplitPdfSheet';
import UploadSheet from '../sheets/library/UploadSheet';
import XrayInsightSheet from '../sheets/library/XrayInsightSheet';
import XrayTermSheet from '../sheets/library/XrayTermSheet';
import PqbAttemptsSheet from '../sheets/practice/PqbAttemptsSheet';
import EditionCalendarSheet from '../sheets/study/EditionCalendarSheet';
import MentorSheet from '../sheets/study/MentorSheet';
import SavedAddLinkSheet from '../sheets/study/SavedAddLinkSheet';
import SearchSheet from '../sheets/study/SearchSheet';
import AllToolsSheet from '../sheets/tabs/AllToolsSheet';
import CoverageSheet from '../sheets/tabs/CoverageSheet';
import CurrentFilterSheet from '../sheets/tabs/CurrentFilterSheet';
import RevisionsSheet from '../sheets/tabs/RevisionsSheet';
import type { OverlayComponent, OverlayKey, SheetComponent, SheetKey, Stage, StageComponent, TabComponent, TabId, ViewDef, ViewId } from './routes';

/** The four arrival stages. The 'app' stage is the shell itself (tabs + tab bar). */
export const STAGE_SCREENS: Readonly<Record<Exclude<Stage, 'app'>, StageComponent>> = {
  book: BookStage,
  intro: IntroStage,
  auth: AuthStage,
  verify: VerifyStage,
};

export const TAB_SCREENS: Readonly<Record<TabId, TabComponent>> = {
  home: HomeTab,
  learn: LearnTab,
  practice: PracticeTab,
  current: CurrentTab,
  menu: MenuTab,
  profile: ProfileTab,
};

/** VIEWS (PrepAssist.html L6509 and every later VIEWS.x = … assignment). */
export const VIEWS: Readonly<Record<ViewId, ViewDef>> = {
  lesson: LessonScreen,
  course: CourseScreen,
  courses: CoursesScreen,
  note: NoteScreen,
  xray: XrayScreen,
  mindmap: MindmapScreen,
  querydb: QuerydbScreen,
  calendar: CalendarScreen,
  cloud: CloudScreen,
  tracker: TrackerScreen,
  engine: EngineScreen,
  tests: TestsScreen,
  history: HistoryScreen,
  answerbank: AnswerbankScreen,
  answer: AnswerScreen,
  pastevals: PastevalsScreen,
  qbank: QbankScreen,
  plan: PlanScreen,
  article: ArticleScreen,
  quiz: QuizScreen,
  mains: MainsScreen,
  mainsResult: MainsResultScreen,
  account: AccountScreen,
  wallet: WalletScreen,
  payments: PaymentsScreen,
  upgrade: UpgradeScreen,
  settings: SettingsScreen,
  status: StatusScreen,
  legal: LegalScreen,
  pqb: PqbScreen,
  testquiz: TestquizScreen,
  syllabus: SyllabusScreen,
  saved: SavedScreen,
  upload: UploadScreen,
  folder: FolderScreen,
  mindmaps: MindmapsScreen,
  notesys: NotesysScreen,
  note2: Note2Screen,
  noteshub: NoteshubScreen,
  xrayhome: XrayhomeScreen,
  onestep: OnestepScreen,
  ntNote: NtNoteScreen,
};

/** SHEETS (L6917-L6936, L7577-L7588) and the sheets the HTML builds inline. */
export const SHEETS: Readonly<Record<SheetKey, SheetComponent>> = {
  credits: CreditsSheet,
  revisions: RevisionsSheet,
  forgot: ForgotSheet,
  changeEmail: ChangeEmailSheet,
  account: AccountSheet,
  prefs: PrefsSheet,
  language: LanguageSheet,
  subscription: SubscriptionSheet,
  payments: PaymentsSheet,
  settings: SettingsSheet,
  privacy: PrivacySheet,
  coverage: CoverageSheet,
  allTools: AllToolsSheet,
  upload: UploadSheet,
  ledger: LedgerSheet,
  lowCredits: LowCreditsSheet,
  delAsk: DelAskSheet,
  mentor: MentorSheet,
  search: SearchSheet,
  editionCalendar: EditionCalendarSheet,
  currentFilter: CurrentFilterSheet,
  purchase: PurchaseSheet,
  pqbAttempts: PqbAttemptsSheet,
  syllabusTopic: SyllabusTopicSheet,
  syllabusFilter: SyllabusFilterSheet,
  savedAddLink: SavedAddLinkSheet,
  cloudDelete: CloudDeleteSheet,
  trackerSplitPdf: TrackerSplitPdfSheet,
  trackerNewFolder: TrackerNewFolderSheet,
  trackerOptional: TrackerOptionalSheet,
  xrayInsight: XrayInsightSheet,
  xrayTerm: XrayTermSheet,
  noteNew: NoteNewSheet,
  noteUpdates: NoteUpdatesSheet,
  trackerInbox: TrackerInboxSheet,
};

export const OVERLAYS: Readonly<Record<OverlayKey, OverlayComponent>> = {
  reel: ReelViewerOverlay,
  planMagic: PlanMagicOverlay,
};
