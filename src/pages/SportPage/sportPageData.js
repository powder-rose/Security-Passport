import { getRegulationClaim } from '../../data/regulationClaims';

export const sportObjects = [
  {
    number: '01',
    title: 'Стадионы',
  },
  {
    number: '02',
    title: 'Спортивные комплексы',
  },
  {
    number: '03',
    title: 'Физкультурно-оздоровительные комплексы',
  },
  {
    number: '04',
    title: 'Спортивные залы и центры',
  },
  {
    number: '05',
    title: 'Ледовые арены',
  },
  {
    number: '06',
    title: 'Бассейны',
  },
  {
    number: '07',
    title: 'Манежи',
  },
  {
    number: '08',
    title: 'Открытые спортивные сооружения',
  },
  {
    number: '09',
    title: 'Иные объекты спорта',
  },
];

export const sportFaqItems = [
  {
    question: 'Каким спортивным объектам нужен паспорт безопасности?',
    answer: getRegulationClaim('202', 'sport.faq.00'),
  },
  {
    question: 'Какое постановление регулирует паспорт объекта спорта?',
    answer: getRegulationClaim('202', 'sport.faq.01'),
  },
  {
    question: 'Сколько категорий опасности существует?',
    answer: getRegulationClaim('202', 'sport.faq.02'),
  },
  {
    question: 'Как определяется категория объекта спорта?',
    answer: getRegulationClaim('202', 'sport.faq.03'),
  },
  {
    question: 'Кто проводит категорирование?',
    answer: getRegulationClaim('202', 'sport.faq.04'),
  },
  {
    question: 'Как оформляется акт обследования?',
    answer: getRegulationClaim('202', 'sport.faq.05'),
  },
  {
    question: 'Сколько времени даётся на разработку паспорта?',
    answer: getRegulationClaim('202', 'sport.faq.06'),
  },
  {
    question: 'С кем согласовывается паспорт объекта спорта?',
    answer: getRegulationClaim('202', 'sport.faq.07'),
  },
  {
    question: 'Какой срок согласования?',
    answer: getRegulationClaim('202', 'sport.faq.08'),
  },
  {
    question: 'Можно ли скачать форму паспорта?',
    answer: getRegulationClaim('202', 'sport.faq.09'),
  },
  {
    question: 'Можно ли публиковать заполненный паспорт?',
    answer:
      'Заполненный паспорт действующего спортивного объекта публично не размещаем, поскольку документ содержит служебную информацию ограниченного распространения и имеет пометку «Для служебного пользования».',
  },
  {
    question: 'Когда паспорт необходимо актуализировать?',
    answer: getRegulationClaim('202', 'sport.faq.11'),
  },
  {
    question: 'Сколько стоит разработка?',
    answer: getRegulationClaim('202', 'sport.faq.12'),
  },
  {
    question: 'Нужен ли паспорт открытому спортивному сооружению?',
    answer: getRegulationClaim('202', 'sport.faq.13'),
  },
];
