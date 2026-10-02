import {
  getRegulationClaim,
} from '../../data/regulationClaims';


export const healthObjects = [
  {
    number: '01',
    title: 'Больницы',
  },
  {
    number: '02',
    title: 'Поликлиники',
  },
  {
    number: '03',
    title: 'Медицинские центры',
  },
  {
    number: '04',
    title: 'Диспансеры',
  },
  {
    number: '05',
    title: 'Стоматологии',
  },
  {
    number: '06',
    title: 'Диагностические центры',
  },
  {
    number: '07',
    title: 'Фармацевтические организации',
  },
  {
    number: '08',
    title: 'Иные медицинские объекты',
  },
];


export const healthFaqItems = [
  {
    question: 'Каким медицинским организациям нужен паспорт безопасности?',
    answer: getRegulationClaim('8', 'health.faq.00'),
  },
  {
    question: 'Нужен ли паспорт частной клинике?',
    answer: getRegulationClaim('8', 'health.faq.01'),
  },
  {
    question: 'Нужен ли паспорт аптеке?',
    answer: getRegulationClaim('8', 'health.faq.02'),
  },
  {
    question: 'Какое постановление регулирует объекты здравоохранения?',
    answer: getRegulationClaim('8', 'health.faq.03'),
  },
  {
    question: 'Сколько категорий предусмотрено?',
    answer: getRegulationClaim('8', 'health.faq.04'),
  },
  {
    question: 'Как определяется категория объекта?',
    answer: getRegulationClaim('8', 'health.faq.05'),
  },
  {
    question: 'Кто входит в комиссию?',
    answer: getRegulationClaim('8', 'health.faq.06'),
  },
  {
    question: 'Сколько времени может работать комиссия?',
    answer: getRegulationClaim('8', 'health.faq.07'),
  },
  {
    question: 'Сколько экземпляров акта составляется?',
    answer: getRegulationClaim('8', 'health.faq.08'),
  },
  {
    question: 'Сколько экземпляров паспорта оформляется?',
    answer: getRegulationClaim('8', 'health.faq.09'),
  },
  {
    question: 'С кем согласовывается паспорт?',
    answer: getRegulationClaim('8', 'health.faq.10'),
  },
  {
    question: 'Какой срок согласования?',
    answer: getRegulationClaim('8', 'health.faq.11'),
  },
  {
    question: 'Как часто нужно актуализировать паспорт?',
    answer: getRegulationClaim('8', 'health.faq.12'),
  },
  {
    question: 'Можно ли скачать форму паспорта?',
    answer: getRegulationClaim('8', 'health.faq.13'),
  },
  {
    question:
      'Можно ли публиковать заполненный паспорт?',
    answer:
      'Реальный заполненный паспорт, содержащий сведения о защищённости действующего объекта, публично не размещаем. Можно показывать официальную форму, структуру документа и обезличенный пример.',
  },
  {
    question: 'Сколько стоит разработка?',
    answer: getRegulationClaim('8', 'health.faq.15'),
  },
];
