package entity

type Theme struct {
	ID        uint `json:"id"`
	Title     string
	Answer    string
	IMGAnswer string
	Status    string
}

func SetThemes() []Theme {
	return []Theme{
		{ID: 1, Title: "Тема 1", Answer: "Пушкин А.С.", IMGAnswer: "https://sun6-20.userapi.com/impg/_LOvXE4SiaeIBwwHbzjr2bzakg6gfiC2mQ1a-g/czlixfGFsvM.jpg?size=576x680&quality=95&sign=1e5d9d5301e81fc2457e656153ff8939&c_uniq_tag=eJYBYp_YqUNS2ysp3JS5vOTFSvGwOrMWr2iTRtUDSEA&type=album"},
		{ID: 2, Title: "Тема 2", Answer: "Толстой Л.Н.", Status: "failed", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYLa3Rd_S6ZMlpClpBgjMrKIlEAw4KD9MgCQ&usqp=CAU"},
		{ID: 3, Title: "Тема 3", Answer: "Некрасов Н.А.", Status: "solved", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR172aaVb-noxDg6Bkkr20gpjNC8qB-2FuXtg&usqp=CAU"},
		{ID: 4, Title: "Тема 4", Answer: "Гоголь Н.В.", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUCAaaVuC1Y18LmuEDsz6N8mabQvQ9z7BmZg&usqp=CAU"},
		{ID: 5, Title: "Тема 5", Answer: "Лермонтов М.Ю.", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUTdSyZGq6mMysaXt59yl2AICvLrA1MgMAfA&usqp=CAU"},
		{ID: 6, Title: "Тема 6", Answer: "Достоевский Ф.М.", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT87SKRpQ7_jZ-lg2FKQemMKotuy7SJA1vHRA&usqp=CAU"},
	}
}
