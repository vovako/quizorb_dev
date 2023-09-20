import { toPage } from "./functions.js"

const QUESTIONS = [
	{ Question: "Пассажир первого поезда «Самара-Оренбург».Один из величайших писателей мировой литературы.", Answer: "ЛЕВ НИКОЛАЕВИЧ ТОЛСТОЙ", IMGAnswer: "https://sun6-20.userapi.com/impg/_LOvXE4SiaeIBwwHbzjr2bzakg6gfiC2mQ1a-g/czlixfGFsvM.jpg?size=576x680&quality=95&sign=1e5d9d5301e81fc2457e656153ff8939&c_uniq_tag=eJYBYp_YqUNS2ysp3JS5vOTFSvGwOrMWr2iTRtUDSEA&type=album", IMGQuestion: "https://xn----7sbbaazuatxpyidedi7gqh.xn--p1ai/i/trans/parovoz/28.jpg", Solved: false },
	{ Question: "«Отец» Штирлица. Работал в Оренбуржье над биографией лидера белого казачества атамана Александра Дутова.", Answer: "ЮЛИАН СЕМЕНОВ", IMGQuestion: "https://cdn.iz.ru/sites/default/files/styles/1920x1080/public/article-2018-10/RIAN_2409537.HR_.ru_.jpg?itok=ftIhTNFz", IMGAnswer: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Dutov.jpg", Solved: false },
	{ Question: "По итогу визита в Оренбург и Бердскую слободу местные жители сделали вывод – приезжал антихрест. Особенно оренбуржцев поразила темная кожа и длинные ногти гостя.", Answer: "АЛЕКСАНДР СЕРГЕЕВИЧ ПУШКИН", IMGAnswer: "https://cdn.fishki.net/upload/post/2021/02/10/3603111/1-ylt1vc6vguq.jpg", IMGQuestion: "https://news.store.rambler.ru/img/63cdade2336b8087642677fdaadb9768?img-1-resize=width%3A1280%2Cheight%3A960%2Cfit%3Acover&img-format=auto", Solved: false },
	{ Question: "Массаракш — распространённое ругательство, употребляемое жителями вымышленной планеты Саракш, дословно обозначающее «Мир наизнанку». Название «Саракш» было	образовано от названия посёлка Саракташ	Оренбургской области, аналогично другому фантастическому топониму в творчестве братьев — названию фигурирующего в романе «Отягощённые злом, или Сорок лет спустя» города Ташлинск, образованного от наименования села Ташла, также расположенного в Оренбургской области.", Answer: "АРКАДИЙ И БОРИС СТРУГАЦКИЕ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtfbEX-h34-aoqS1jFa7-koDP0RFSTikYy2w&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPlGxW1-8QC5-Q-MyA91kJZZcaBkIBDhN1Eg&usqp=CAU", Solved: false },
	{ Question: "Наставник цесаревича Александра Николаевича, посещал Оренбуржье вместе со своим учеником. Автор	слов государственного гимна Российской империи «Боже, Царя храни!».", Answer: "ВАСИЛИЙ АНДРЕЕВИЧ ЖУКОВСКИЙ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_aQkhc45GJ0aKH4nvDO2izOZvJw5TWpzvHg&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMi4i6jV0wmBG44zJ43o2jhSwWOoFFHKC5jw&usqp=CAU", Solved: false },
	{ Question: "С Оренбургским краем был связан с начала своей биографии Его отец армейским офицер, последние годы жизни (1749-1754) служил в Оренбурге, где будущий поэт получил первоначальное образование. \n«Заметил Пушкина» и «в гроб сходя благословил».", Answer: "ГАВРИЛА РОМАНОВИЧ ДЕРЖАВИН", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYLa3Rd_S6ZMlpClpBgjMrKIlEAw4KD9MgCQ&usqp=CAU", IMGQuestion: "https://ic.pics.livejournal.com/viktoriiako/72565754/1294461/1294461_900.png", Solved: false },
	{ Question: "Отец русской истории, именно он придал современное толкование термину «промышленность». Родился в Преображенке в Бузулукского уезда.", Answer: "НИКОЛАЙ МИХАЙЛОВИЧ КАРАМЗИН", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfRl2PIUCqsZ_UCwwJvYa7_B2W90m_2KsFDA&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuzPUZ8Ct1rWiXjozm7kyR0Tf1-QBDNN62IQ&usqp=CAU", Solved: false },
	{ Question: "Назовите известного писателя.", Answer: "СЕРГЕЙ ТИМОФЕЕВИЧ АКСАКОВ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb5-FyYMzaAOlyk6dXGB58znEljL_umMCUnA&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7X_wQ0sPUzWyAOvW256mnbkZ2aUllwEztEg&usqp=CAU", Solved: false },
	{ Question: "Благодаря ему мы знаем какой бывает «Горячий снег» и том как «Батальоны просят Огня».", Answer: "ЮРИЙ ВАСИЛЬЕВИЧ БОНДАРЕВ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFEFzXQpkK_JisZ-1PAfdC6d-us1SVeBXwaw&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNC2XqnhIBmhVCn4gr51OZ_3obI72RDMxIZQ&usqp=CAU", Solved: false },
	{ Question: "Советский палеотолог, писатель-фантаст и социальный мыслитель. Автор романов «Туманность Андромеды», «Таис Афинская» и «Лезвие бритвы». Участвовал в раскопках Карталинского рудгого поля.", Answer: "ИВАН АНТОНОВИЧ ЕФРЕМОВ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFgls6BAxha1BD3sjdjYh2Ws368ucP20J1Cg&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkiGG7rbKp9FsmBHxqGnJ3QSSufcShFrVXEA&usqp=CAU", Solved: false },
	{ Question: "Актёр Магнитогорский драматический театр имени А. С. Пушкина Оренбургский областной драматический театр	имени М. Горького, а потом и Московский драматический театр на Малой Бронной. \nИменно он попросил Максима Максимовича Исаева остаться после совещания.", Answer: "ЛЕОНИД СЕРГЕЕВИЧ БРОНЕВОЙ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR172aaVb-noxDg6Bkkr20gpjNC8qB-2FuXtg&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTvroe5WmLkpRwmueK02UM0-ebDzZLc16oNw&usqp=CAU", Solved: false },
	{ Question: "Жил в Оренбуржье до Большого каретного.", Answer: "ВЛАДИМИР СЕМЁНОВИЧ ВЫСОЦКИЙ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUPeyFUNdZPwZcRBRQvNSHGZBp6kxtDKHfAw&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy3jAFwTP9fawqjpORSjrUwa7dvQs52JnKTw&usqp=CAU", Solved: false },
	{ Question: "Французский рестлер, более известным под именем	Французский ангел. Родился на территории оренбургской губернии. Прототипом какого мультипликационного персонажа она стал?", Answer: "МОРИС ТИЙЕ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH_PiP_wdLMo8ghTc8sf5iqU5ZAVNM3kqQMw&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeUMAxfZ091xon5ba5QS2kR2BMgvS_uI4vfQ&usqp=CAU", Solved: false },
	{ Question: "Голос Гарри Поттера и Фродо Беггинса, быший солист группы Revolvers.", Answer: "АЛЕКСЕЙ ЕЛИСТРАТОВ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSus-FQ5TxSxsKkmaKzDlhICZPNXDMkIsqmDg&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSA93NyAvMfBtSJ2EDUCE7iMWQGNoY6a-1kQ&usqp=CAU", Solved: false },
	{ Question: "Назовите популярного исполнителя.", Answer: "ЮРА ШАТУНОВ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7zeVV58Uvmz0iuuY5QAYSdCM2sXMcJex86A&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN4b4hhNYWHVx6qTw-9ftf0wGp8iDzAM6p6Q&usqp=CAU", Solved: false },
	{ Question: "", Answer: "АННА ЛИННИКОВА", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUCAaaVuC1Y18LmuEDsz6N8mabQvQ9z7BmZg&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGtTiDrBbtecJeL0on2qpufIaCZIPfS9Ikqg&usqp=CAU", Solved: false },
	{ Question: "", Answer: "АЛЕКСАНДР ЗАСС", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoacD98i06v4hqCD68jTW2NX-hoiT7VUOTOg&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf_JUs1s3npadfarQCZ3NQWxDF9JNpt0QJdg&usqp=CAU", Solved: false },
	{ Question: "", Answer: "ОЛЬГА ОСТРОУМОВА", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN0FA6_PwO1wFKcLTlE27JQW0-UUP6jop0FQ&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVQyPRxwgGnhxUP4ctblsIlwwEeu3g4N-QNA&usqp=CAU", Solved: false },
	{ Question: "", Answer: "ЛАРИСА ГУЗЕЕВА", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXU1Jry2L35F2OGNajFkRfKGaHuUnRjfbo2g&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWyROUCbXtAK-sEYr7GCiMOpl-Ql-tSK0pTw&usqp=CAU", Solved: false },
	{ Question: "", Answer: "НИКОЛАЙ II", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgsLmB3rbNA-P0d_GZOq7YgEhkA06eJF1Jwg&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShGusi1Xuoi-y3C6ZkXlwsJFpZH9tz2_MBNQ&usqp=CAU", Solved: false },
	{ Question: "Император Всероссийский, который по одной из легенд закончил жизнь как старец Федор Кузьмич.", Answer: "АЛЕКСАНДР I", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUTdSyZGq6mMysaXt59yl2AICvLrA1MgMAfA&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaBTHbgOaxLajtK_lnAvGykxw4O_34LubWKw&usqp=CAU", Solved: false },
	{ Question: "Освободитель и Вешатель, пережил 7 покушений.", Answer: "АЛЕКСАНДР II", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvdDBdmJNHj6Ds5TDeOSHzmqtN6H0y--Y07g&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqbMRincO18CRhYuyoNwtYyOynfBBa_A4lLA&usqp=CAU", Solved: false },
	{ Question: "", Answer: "ПЕТР АРКАДЬЕВИЧ СТОЛЫПИН", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTYLX8d5NyRB2n6hmhW2USaS08xvEQmmriFw&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyfc9hFse88flfy8q4K2Lyh6e1gTcbV3rCKg&usqp=CAU", Solved: false },
	{ Question: "Этот Оренбуржец однажды стал руководителем Советского Союза, правда не на долго. В настоящее время его память никак не увековечена в нашем городе, вероятно в связи со спорным характером его наследия. Последние 33 года жизни провёл практически в забвении и отчуждении от политики.", Answer: "ГЕОРГИЙ МАКСИМИЛИАНОВИЧ МАЛЕНКОВ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqLw9qmFfSQjBKCzOiPgLtKG3mgCvltXHhHw&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqLw9qmFfSQjBKCzOiPgLtKG3mgCvltXHhHw&usqp=CAU", Solved: false },
	{ Question: "Весь мир сейчас идёт наоборот. Назовите автора цитаты.", Answer: "ВИКТОР СТЕПАНОВИЧ	ЧЕРНОМЫРДИН", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOira3B5QFu7JW2m50hzNAOX8DU9ANRKjBNw&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0FiHnvQLvGOnUNQ6Vg8p_aEYM0IG-GVvoKA&usqp=CAU", Solved: false },
	{ Question: "Герой обороны Сталинграда. В американском фильме «Враг у ворот» его роль исполнил известный актёр Джуд Лоу.	Его книга является настольным пособием снайперов армии США. Кто он?", Answer: "ВАСИЛИЙ ЗАЙЦЕВ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjdN2vTriCFYnxVpRCvR-ULe8c_UEUeGv34w&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjng063Yv8_g7w8asF9BiYq6X8n4FZKB6yog&usqp=CAU", Solved: false },
	{ Question: "Один из самых знаминитых героев Великой Отечественной войны. Его подвиг был повторён более 400 раз. Наш герой проходил обучение в Краснохолмском пехотном училище. Кто он?", Answer: "АЛЕКСАНДР МАТРОСОВ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0LLxK2nwdEsc2GjTpO1Z0btoGy35EE9pfoA&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkZ-rtR2CMMmTDpUNMmvblsqP3z9j9l878lA&usqp=CAU", Solved: false },
	{ Question: "Вероятнее всего именно этот человек и доблесть ввереного ему военного соединения остановили нацистов в Сталинграде. Дважды герой Совесткого Союза, уроженец	Шарлыка, кто он?", Answer: "АЛЕКСАНДР ИЛЬИЧ	РОДИМЦЕВ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZd1Lx1kvEJEu_kzsNleqvJ2sRn3LL2f6zxQ&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-w-mRLXFv8DT0kHh0GJQnxvOIubPGDnx3sw&usqp=CAU", Solved: false },
	{ Question: "Советская лётчица, единственная в мире женщина, совершившая воздушный таран, обучалась в Оренбургской военной авиационной школе лётчиков", Answer: "ЕКАТЕРИНА ЗЕЛЕНКО", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRPkGYrYJqEKsQ58lggE7K12EWk0KHouSlKg&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE1oZJwh8JPi3FzwtvaR8hrTZkoxqu6kxPaQ&usqp=CAU", Solved: false },
	{ Question: "17 марта 2016 года, находившийся неделю в тылу противника, был окружён боевиками «Исламского государства» в районе населённого пункта Тадмор (провинция Хомс, Сирия). Старший лейтенант вступил в бой с террористами и не желая	сдаваться в плен, вызвал авиаудар на себя. Вместе с	геройски погибшим офицером были уничтожены и окружившие его боевики «Исламского государства». Назовите фамилию героя.", Answer: "АЛЕКСАНДР ПРОХОРЕНКО", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT87SKRpQ7_jZ-lg2FKQemMKotuy7SJA1vHRA&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Q4H5df1_vfrDYdQhJvzSraYIXgUIRhx6vw&usqp=CAU", Solved: false },
	{ Question: "Вместе с группой «Вымпел» прибыл в город Беслан республики Северная Осетия — Алания, где 1 сентября 2004 года более тридцати террористов под захватили в заложники свыше 1100 детей и взрослых в здании школы № 1.\n\nПосле того, как на третий день в спортзале, где содержались большинство заложников, произошли взрывы, вызвавшие частичное	обрушение крыши и стен спортзала, выжившие люди стали разбегаться. Оперативно-боевая группа, в составе которой был наш герой, получила приказ на штурм здания, так как боевики открыли шквальный огонь по заложникам. Первым проник в помещение столовой, куда боевики перегнали выживших после взрывов в спортзале заложников, и лично	уничтожил одного террориста. Когда другой бандит бросил в скопление людей гранату, спас жизни заложникам, закрыв их от взрыва своим	телом. Уроженец города Орска. Назовите фамилию героя.", Answer: "АНДРЕЙ ТУРКИН", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9m0iNxRszJs-KiWE1MQsas5aS2BhDHVn72zLx0ODX83DkLCqMQYvGrCvPCflsIYjywgI&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDaSfsIfHbfD4tQIQ2C6G-5LKGXt5IGjS9Jw&usqp=CAU", Solved: false },
	{ Question: "Русский военный, участник Белого движения, атаман Оренбургского казачества, генерал-лейтенант. Предводитель казацкого восстания на Урале в 1918	году. Участник «Голодного похода». Был ликвидирован	диверсионной группой ВЧК в Китае в 1921 году.", Answer: "АЛЕКСАНДР ИЛЬИЧ ДУТОВ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_c95UWGTXsnnS_X6yIkIpVgaBx7oGKUS7Kg&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_c95UWGTXsnnS_X6yIkIpVgaBx7oGKUS7Kg&usqp=CAU", Solved: false },
	{ Question: "Лётчик и воздухоплаватель, первый в мире летчик-бомбардировщик, первый в Российской Империи военный летчик-инструктор. Окончил Оренбургский	Неплюевский кадетский корпус.", Answer: "ГЕОРГИЙ ГОРШКОВ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyUc4f87A4Aer9rSPk9qvnppJzjuBDbg5MxA&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyUc4f87A4Aer9rSPk9qvnppJzjuBDbg5MxA&usqp=CAU", Solved: false },
	{ Question: "Одна из самых известных исторических личностей эпохи Гражданской войны в России. Увековечен в книге Дмитрия	Фурманова «Чапаев» и одноимённом фильме братьев	Васильевых, а также в многочисленных анекдотах.", Answer: "ВАСИЛИЙ ИВАНОВИЧ ЧАПАЕВ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_20Sja3Crl0r4NhJnOHcRNYwWGLwdW4uKvQ&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnZC8faJBqtzxNavH-p7qkc_aYNXTPyCa0JA&usqp=CAU", Solved: false },
	{ Question: "Оренбургский космонавт. Отец космонавта.", Answer: "РОМАНЕНКО ЮРИЙ ВИКТОРОВИЧ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvXSageHgipcOt42TZeff9aaWonzy0KrQNRQ&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiS0tSGEzoFvqb7JUtpfQuOXsr5wMwB1F-PA&usqp=CAU", Solved: false },
	{ Question: "Первый советский космонавт, побывавший в космосе дважды. Первый космонавт, погибший в ходе полёта. Его космический аппарат разбился в Оренбургской области.", Answer: "КОМАРОВ ВЛАДИМИР	МИХАЙЛОВИЧ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEDVgXSEH14rydFPQx-Jvucw8brkYGblnZyA&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEDVgXSEH14rydFPQx-Jvucw8brkYGblnZyA&usqp=CAU", Solved: false },
	{ Question: "Назовите фамилию, имя и отчество жены Гагарина в девичестве.", Answer: "ВАЛЕНТИНА ИВАНОВНА ГОРЯЧЕВА", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC9I5a8-Q37DVZ33Jjz-sd-_7QNIzelzE_BA&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4k24svAcp2nHFjPwi8yUI8vrhjrnSGwd-Pg&usqp=CAU", Solved: false },
	{ Question: "Светский учёный-радиотехник и кибернетик, основоположник отечественной школы биологической кибернетики и биотехнических систем и технологий. Родился в Оренбурге, где его семья проживала на улице Советской.", Answer: "АКСЕЛЬ БЕРГ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKq2UZc2rerBpOtVYA6R2a8oTs-TRzogTyWg&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSeC1pwMf4U36c00POZdWYjOMpFoSRHEYJbA&usqp=CAU", Solved: false },
	{ Question: "Советский физик, академик Академии наук СССР, один из основателей совесткой атомной школы. Родился и вырос в Оренбурге.", Answer: "ПЁТР ИВАНОВИЧ ЛУКИРСКИЙ", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsgiz_-hUvcqq9kqzGm8dj19EVxf8aDOOwbw&usqp=CAU", IMGQuestion: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsgiz_-hUvcqq9kqzGm8dj19EVxf8aDOOwbw&usqp=CAU", Solved: false },
	{ Question: "Советский и российский физик, академик РАН (2019). Директор Института физики твердого тела РАН (2002—2017),	академик-секретарь Отделения физических наук (с 2022), член ряда комиссий, советов и иных авторитетных органов РАН. Родился и вырос в Оренбурге.", Answer: "ВИТАЛИЙ ВЛАДИМИРОВИЧ КВЕДЕР", IMGAnswer: "https://www.eduspb.com/public/img/biography/k/kveder_vv.jpg", IMGQuestion: "https://media.fulledu.ru/documents/covers/2018.04.13.11/article/100060000000000000002954.jpg", Solved: false },
	{ Question: "Последний президент Академии наук СССР, учёный в области вычислительной математики, физики атмосферы, геофизики. Уроженец села Петрохеронец Грачёвского	района Оренбургской губернии.", Answer: "ГУРИЙ ИВАНОВИЧ МАРЧУК", IMGAnswer: "https://avatars.mds.yandex.net/i?id=8ec2cbcb1ab3a25ab1c7087f8d7931eeeec90aa8-9266608-images-thumbs&n=13", IMGQuestion: "https://avatars.mds.yandex.net/i?id=53d472ebf46191383d71bf0398163f86-4809466-images-thumbs&n=13", Solved: false },
	{ Question: "Кристаллограф, минералог и математик. Академик Российской академии наук, директор петербургского Горного института (1905—1910). Член организации «Земля и Воля». Родился в Оренбурге.", Answer: "ЕВГРАФ СТЕПАНОВИЧ ФЕДОРОВ", IMGAnswer: "https://avatars.mds.yandex.net/i?id=5ea000b89321dc7c42bbcae8ae06a0ba-4120598-images-thumbs&n=13", IMGQuestion: "https://avatars.mds.yandex.net/i?id=796e2a441d078495c817f1a9cf083224fb94dd6a-4073135-images-thumbs&n=13", Solved: false },
	{ Question: "", Answer: "ИГОРЬ ЯКОВЛЕВИЧ СТЕЧКИН", IMGAnswer: "https://avatars.mds.yandex.net/i?id=4a8d75ba6e5217e54bcef1c4ac2b95789cddb10a-7464698-images-thumbs&n=13", IMGQuestion: "https://avatars.mds.yandex.net/i?id=f8dcbdd348dfac8a328b14ab3aa7badac125e135-9461051-images-thumbs&n=13", Solved: false },
	{ Question: "Немецкий географ, натуралист и путешественник, один из основателей географии как самостоятельной науки", Answer: "БАРОН ФРИДРИХ	ВИЛЬГЕЛЬМ ГЕНРИХ АЛЕКСА́НДР ФОН	ГУ́МБОЛЬДТ", IMGAnswer: "https://avatars.mds.yandex.net/i?id=26f2642de79282fbd41a56f111ea86922619f688-4115767-images-thumbs&n=13", IMGQuestion: "https://avatars.mds.yandex.net/i?id=45e5dafe791e6315b2d2d2b59426e3bcc285be51-6849173-images-thumbs&n=13", Solved: false },
	{ Question: "«Один из наиболее выдающихся естествоиспытателей всех стран и времён…» — так начинается персоналия Ф. П. Кеппена об учёном в «Русском биографическом словаре». «…Природный немец, родом пруссак, <…> отдавший всю жизнь России… отличался <…> широтой своих научных интересов, попытками научного, глубокого творчества в области искания обобщений в наблюдательных науках, <…> колоссальной работоспособностью и точным владением вечными	элементами научного метода…», — сказал В. И.Вернадский", Answer: "ПЁТР СИМОН ПАЛЛАС", IMGAnswer: "https://avatars.mds.yandex.net/i?id=d5456abde464a3eaf88e64fa909345902fdf1655-9156576-images-thumbs&n=13", IMGQuestion: "https://avatars.mds.yandex.net/i?id=0a919728eea6a20290119417c492c35c41629d76-9069510-images-thumbs&n=13", Solved: false },
	{ Question: "Первый «Заслуженый географ Российской Федерации». Вице-президент Русского географического общества", Answer: "АЛЕКСАНДР АЛЕКСАНДРОВИЧ ЧИБИЛЕВ", IMGAnswer: "https://avatars.mds.yandex.net/i?id=7ec901014cdc53923fda9def49f47d8d683fdd8b-6254930-images-thumbs&n=13", IMGQuestion: "https://avatars.mds.yandex.net/i?id=e422686e7965b2b8a2389c0123c9c56e-4435835-images-thumbs&n=13", Solved: false },
]
let curQuestionIndex = null

function interfacePage() {
	const ws = new WebSocket('wss://c5ae-176-28-64-201.ngrok-free.app/websocket/connection')
	localStorage.clear()//_temp_
	const state = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : { members: [], page: '' }

	ws.onopen = function() {
		console.log('open');
	}

	if (state.members.length) {
		updateIntroMembersList()
	}

	// viewWin.onload = function () {
	// 	const msg = {
	// 		msg: 'start',
	// 		data: QUESTIONS.length
	// 	}
	// 	viewWin.postMessage(JSON.stringify(msg), location.origin)
	// }

	const tilesBox = document.querySelector('.intro-tiles__container')
	QUESTIONS.forEach((q, i) => {
		tilesBox.insertAdjacentHTML('beforeend', `
			<div class="intro-tiles-item"  data-tiles-id="${i}">
				<div class="intro-tiles-item__header">
					<div class="intro-tiles-item__number">${i + 1}</div>
					<div class="intro-tiles-item__image">
						<img src="${q.IMGQuestion}" alt="">
					</div>
					<button class="intro-tiles-item__apply-btn">Выбрать</button>
				</div>
				
				<div class="intro-tiles-item__descr">${q.Question}</div>
			</div>
		`)
	});

	const openMembersBtn = document.querySelector('.intro-members__open-btn')
	openMembersBtn.addEventListener('click', function (evt) {
		const mainBlock = openMembersBtn.parentElement
		if (!mainBlock.classList.contains('active')) {
			updateHeightIntroMembersList()
		} else if (evt.target === openMembersBtn.querySelector('img')) {
			mainBlock.style.bottom = null
			mainBlock.classList.remove('active')
		}
	})

	const addMemberBtn = document.querySelector('.intro-members__add-member-block button')
	addMemberBtn.addEventListener('click', function () {
		const addMemberBlock = addMemberBtn.closest('.intro-members__add-member-block')
		const surname = addMemberBlock.querySelector('[name="surname"]')
		const name = addMemberBlock.querySelector('[name="name"]')

		state.members.push({
			name: name.value,
			surname: surname.value,
			id: state.members.length,
			points: 0
		})

		updateIntroMembersList()

		surname.value = ''
		name.value = ''
	})

	const beginGameBtn = document.querySelector('.intro__begin-quiz-btn')
	beginGameBtn.addEventListener('click', function () {

		if (state.members.length) {
			toTiles()
		} else {
			const membersOpenBtn = document.querySelector('.intro-members__open-btn')
			membersOpenBtn.classList.remove('empty-list')
			setTimeout(() => {
				membersOpenBtn.classList.add('empty-list')
			})
		}
	})


	function updateIntroMembersList() {
		const addMemberBlock = document.querySelector('.intro-members__add-member-block')
		const membersCountEl = document.querySelector('.intro-members__open-btn span')
		while (addMemberBlock.nextElementSibling) {
			addMemberBlock.nextElementSibling?.remove()
		}

		state.members.forEach(member => {
			addMemberBlock.insertAdjacentHTML('afterend', `
			<div class="intro-members-item" data-member-id="${member.id}">
				<div class="intro-members-item__surname">${member.surname}</div>
				<div class="intro-members-item__name">${member.name}</div>
				<button class="intro-members-item__delete-btn">Удалить</button>
			</div>
			`)
		})
		updateHeightIntroMembersList()

		membersCountEl.textContent = state.members.length

		localStorage.setItem('state', JSON.stringify(state))
	}

	function updateHeightIntroMembersList() {
		const introMembersEl = document.querySelector('.intro-members')
		const wrapper = introMembersEl.querySelector('.intro-members__wrapper')
		introMembersEl.style.bottom = wrapper.clientHeight + 'px'
		introMembersEl.classList.add('active')
	}

	function membersReset() {
		const membersBox = document.querySelector('.members__list')
		membersBox.classList.remove('lock')
		membersBox.innerHTML = ''

		state.members.forEach(member => {
			membersBox.insertAdjacentHTML('beforeend', `
			<div class="members-item" data-member-id="${member.id}">
			<div class="members-item__points">${member.points}</div>
				<div class="members-item__name">${member.surname} ${member.name}</div>
				<button class="members-item__deny-btn">Неправильно</button>
				<button class="members-item__apply-btn">Правильно</button>
			</div>
			`)
		})
	}

	function toTiles() {
		const qStatuses = Array.from(QUESTIONS.map(q => q.Solved))

		const msg = {
			msg: 'tiles',
			data: qStatuses
		}
		viewWin.postMessage(JSON.stringify(msg), location.origin)

		toPage('tiles')
	}

	function toMembers() {
		membersReset()
		const msg = {
			msg: 'question',
			data: {
				Question: QUESTIONS[curQuestionIndex].Question,
				IMGQuestion: QUESTIONS[curQuestionIndex].IMGQuestion
			}
		}
		viewWin.postMessage(JSON.stringify(msg), location.origin)

		toPage('members')
	}

	function toAnswer() {
		const msg = {
			msg: 'answer',
			data: {
				Answer: QUESTIONS[curQuestionIndex].Answer,
				IMGAnswer: QUESTIONS[curQuestionIndex].IMGAnswer
			}
		}
		viewWin.postMessage(JSON.stringify(msg), location.origin)
	}


	document.addEventListener('click', function (evt) {
		const target = evt.target

		if (target.classList.contains('members-item') && !target.classList.contains('active') && !target.classList.contains('disabled') && !target.classList.contains('solved') && !target.closest('.members__list.lock')) {
			document.querySelector('.members-item.active')?.classList.remove('active')
			target.classList.add('active')
		} else if (target.classList.contains('members-item__deny-btn')) {
			const item = target.closest('.members-item')
			item.classList.remove('active')
			item.classList.add('disabled')
		} else if (target.classList.contains('members-item__apply-btn')) {
			const item = target.closest('.members-item')
			item.classList.remove('active')
			item.classList.add('solved')

			const memberId = +item.dataset.memberId
			const member = state.members.filter(m => m.id === memberId)[0]
			member.points++

			const pointsEl = item.querySelector('.members-item__points')
			pointsEl.textContent = member.points
			target.closest('.members__list').classList.add('lock')

			QUESTIONS[curQuestionIndex].Solved = true
			document.querySelectorAll('.intro-tiles-item')[curQuestionIndex].classList.add('checked')

			toAnswer()
		} else if (target.hasAttribute('data-page-target')) {
			toPage(target.dataset.pageTarget)
		} else if (target.classList.contains('intro-tiles-item__apply-btn') && !target.classList.contains('checked')) {
			curQuestionIndex = +target.closest('.intro-tiles-item').dataset.tilesId
			toMembers()
		} else if (target.classList.contains('members__back-btn')) {
			toTiles()
		} else if (target.classList.contains('intro-members-item__delete-btn')) {
			const memberId = +target.closest('.intro-members-item').dataset.memberId
			const memberIndex = state.members.findIndex(m => m.id === memberId)
			state.members.splice(memberIndex, 1)
			updateIntroMembersList()
		}
	})
}

export default interfacePage