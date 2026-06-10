package model

func SeedData() {
	// 用户（含用户名和密码）
	Users["c01"] = &User{ID: "c01", Username: "zhangguonong", Password: "123456", Name: "张果农", Role: "consumer", Phone: "13800001111", Location: "福建"}
	Users["m01"] = &User{ID: "m01", Username: "fujianmingpin", Password: "123456", Name: "福建茗品茶厂", Role: "merchant", Phone: "13800002222", Location: "福建"}
	Users["m02"] = &User{ID: "m02", Username: "shandongfengshou", Password: "123456", Name: "山东丰收食品厂", Role: "merchant", Phone: "13800003333", Location: "山东"}
	Users["m03"] = &User{ID: "m03", Username: "zhejianglongjing", Password: "123456", Name: "浙江龙井茶园", Role: "merchant", Phone: "13800004444", Location: "浙江"}
	Users["ct01"] = &User{ID: "ct01", Username: "fujiangongshang", Password: "123456", Name: "福建省工商认证中心", Role: "certifier", Phone: "13800005555", Location: "福建"}
	Users["ct02"] = &User{ID: "ct02", Username: "youjirenzheng", Password: "123456", Name: "有机食品认证协会", Role: "certifier", Phone: "13800006666", Location: "北京"}
	Users["ad01"] = &User{ID: "ad01", Username: "admin", Password: "admin123", Name: "平台管理员", Role: "admin", Phone: "13800007777", Location: "北京"}
	Users["rg01"] = &User{ID: "rg01", Username: "shiyaojian", Password: "123456", Name: "食品安全监管局", Role: "regulator", Phone: "13800008888", Location: "北京"}

	// 商品
	Products = []Product{
		{ID: "P001", Name: "有机铁观音", Category: "茶叶", Origin: "福建安溪", Price: 288, Image: "🍵", Certification: "有机", Traceable: true, ShopID: "m01", ShopName: "福建茗品茶厂", CreatedAt: "2026-06-01"},
		{ID: "P002", Name: "武夷山大红袍", Category: "茶叶", Origin: "福建武夷山", Price: 580, Image: "🫖", Certification: "地理标志", Traceable: true, ShopID: "m01", ShopName: "福建茗品茶厂", CreatedAt: "2026-06-02"},
		{ID: "P003", Name: "龙井绿茶", Category: "茶叶", Origin: "浙江杭州", Price: 350, Image: "🍃", Certification: "绿色", Traceable: true, ShopID: "m03", ShopName: "浙江龙井茶园", CreatedAt: "2026-06-03"},
		{ID: "P004", Name: "红富士苹果", Category: "果蔬", Origin: "山东烟台", Price: 68, Image: "🍎", Certification: "绿色", Traceable: true, ShopID: "m02", ShopName: "山东丰收食品厂", CreatedAt: "2026-06-04"},
		{ID: "P005", Name: "阳光玫瑰葡萄", Category: "果蔬", Origin: "云南大理", Price: 128, Image: "🍇", Certification: "有机", Traceable: true, ShopID: "m01", ShopName: "福建茗品茶厂", CreatedAt: "2026-06-05"},
	}

	// 资质
	Qualifications = []Qualification{
		{ID: "Q001", HolderID: "m01", HolderName: "福建茗品茶厂", Type: "Location", Value: "福建", Status: "active", CertifierID: "ct01", CertifierName: "福建省工商认证中心", IssuedAt: "2026-01-01", ExpiresAt: "2027-01-01"},
		{ID: "Q002", HolderID: "m01", HolderName: "福建茗品茶厂", Type: "Capability", Value: "制茶", Status: "active", CertifierID: "ct01", CertifierName: "福建省工商认证中心", IssuedAt: "2026-01-01", ExpiresAt: "2027-01-01"},
		{ID: "Q003", HolderID: "m01", HolderName: "福建茗品茶厂", Type: "Quality", Value: "有机", Status: "active", CertifierID: "ct02", CertifierName: "有机食品认证协会", IssuedAt: "2026-02-01", ExpiresAt: "2027-02-01"},
		{ID: "Q004", HolderID: "m01", HolderName: "福建茗品茶厂", Type: "Grade", Value: "3", Status: "active", CertifierID: "ct01", CertifierName: "福建省工商认证中心", IssuedAt: "2026-03-01", ExpiresAt: "2026-08-01"},
		{ID: "Q005", HolderID: "m02", HolderName: "山东丰收食品厂", Type: "Location", Value: "山东", Status: "active", CertifierID: "ct01", CertifierName: "福建省工商认证中心", IssuedAt: "2026-01-01", ExpiresAt: "2027-01-01"},
		{ID: "Q006", HolderID: "m02", HolderName: "山东丰收食品厂", Type: "Capability", Value: "果蔬加工", Status: "active", CertifierID: "ct01", CertifierName: "福建省工商认证中心", IssuedAt: "2026-01-01", ExpiresAt: "2027-01-01"},
		{ID: "Q007", HolderID: "m03", HolderName: "浙江龙井茶园", Type: "Location", Value: "浙江", Status: "active", CertifierID: "ct01", CertifierName: "福建省工商认证中心", IssuedAt: "2026-01-01", ExpiresAt: "2027-01-01"},
		{ID: "Q008", HolderID: "m03", HolderName: "浙江龙井茶园", Type: "Capability", Value: "制茶", Status: "active", CertifierID: "ct01", CertifierName: "福建省工商认证中心", IssuedAt: "2026-01-01", ExpiresAt: "2027-01-01"},
	}

	// 产品档案
	Archives["P001"] = []ArchiveNode{
		{Step: "种植", Location: "福建安溪茶园基地", Time: "2026-03-15 08:00", Desc: "春季新芽采摘，有机种植标准", Public: true},
		{Step: "加工", Location: "福建茗品加工车间", Time: "2026-03-20 14:00", Desc: "传统工艺炒制，质检合格", Public: true},
		{Step: "质检", Location: "福建省茶叶检测中心", Time: "2026-04-01 10:00", Desc: "农残检测通过", Public: false},
		{Step: "运输", Location: "顺丰冷链枢纽", Time: "2026-04-05 09:00", Desc: "恒温运输", Public: false},
		{Step: "到店", Location: "品牌旗舰店", Time: "2026-04-10 16:00", Desc: "上架销售", Public: true},
	}
}
