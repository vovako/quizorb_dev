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
		{ID: 1, Title: "Тема 1", Answer: "Пушкин А.С.", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR40_Y9C-iQ9LL1MHOLeXHRi85qQpqra8V2OA&usqp=CAU"},
		{ID: 2, Title: "Тема 2", Answer: "Толстой Л.Н.", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqfkuON9pEYuBrAvtYZilSgfieI9G9t6NybiPgGT4GR609DQJQGqfLfNaw_cPLM2pnCrw&usqp=CAU"},
		{ID: 3, Title: "Тема 3", Answer: "Некрасов Н.А.", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdYwv3RtjrVrSiEa_KM3njOsByeWDpHw2QYRySxcKJ8QaX3FZ97Ce-SDKuMV63MJb4M-M&usqp=CAU"},
		{ID: 4, Title: "Тема 4", Answer: "Гоголь Н.В.", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd8fD4_sVpsjhSPJ5HRgcJ0vrz1LAti6rH5vv0rlPuVVywMWMRvZ_T0CWy7rA2m5mpYeY&usqp=CAU"},
		{ID: 5, Title: "Тема 5", Answer: "Лермонтов М.Ю.", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH6Jg0d4SJ89Fh4RUnWwig_NLZvKmo5eUoxQ7wXiAzgl6risTqT5XJ6bt3PorJhQADoBk&usqp=CAU"},
		{ID: 6, Title: "Тема 6", Answer: "Достоевский Ф.М.", IMGAnswer: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROIw_kJBnK2zsHUK8prfG7sff8-Nd6-7WTvMBwg0F3G--uL8WgCgfYwn7tv1cbvgl30Pc&usqp=CAU"},
	}
}
