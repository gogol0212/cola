// ============================================================
// 产品责任数据（双模式产品详情系统）
// 新增产品时：只需在此文件增加一个条目，页面自动生成，不重复开发。
// 数据结构由 ProductDutyData 约束，字段说明见各类型定义。
// ============================================================

export type Chip = { label: string; value: string; tone?: "brand" | "olive" };

// —— 保障地图（客户阅读模式）——
// 用客户能看懂的语言概括一项责任，点击展开合同原文级别的细节。
export type Responsibility = {
  /** 稳定 id，用于锚点与展业查询的关键字 */
  key: string;
  /** 客户友好标题，例如「院外特药与创新治疗支持」 */
  title: string;
  /** 合同语言标题，例如「可选责任2 · 院外特定药械费用补偿金」 */
  contract: string;
  /** 归属分组：普通住院保障 / 大病治疗保障 / 高端医疗资源 / 海外医疗支持 / 创新药械支持 / 意外保障 */
  group: string;
  /** 解决什么问题 */
  problem: string;
  /** 核心数字：免赔额 / 赔付比例 / 限额 */
  chips: Chip[];
  /** ✓ 保障内容清单 */
  details: string[];
  /** 关联的药品/医院分类 id（见 drugClasses / hospitalClasses） */
  related?: string[];
  /** 是否必选（基本责任） */
  required?: boolean;
};

// —— 药品 / 医院库（顾问查询模式）——
export type DrugClass = { id: string; name: string; count: number; note?: string };
export type Drug = { name: string; brand?: string; category: string; purpose?: string };

export type HospitalClass = { id: string; name: string; count: number };
export type Hospital = { name: string; category: string; city?: string };

// —— 完整责任数据库（专业模式表格）——
export type RowCell = string | { text: string; tone?: "brand" | "olive" | "muted" };
export type FullGroup = {
  title: string;
  chips?: Chip[];
  headers: string[];
  rows: RowCell[][];
  note?: string;
};
export type FullSection = {
  id: string;
  title: string;
  intro?: string;
  groups: FullGroup[];
  footnotes?: string[];
};

// —— 案例分析（客户阅读模式）——
export type CaseSettlement = {
  heading: string;
  expenses: { label: string; value: string; accent?: boolean }[];
  withoutInsurance: { title: string; lines: string[]; total: string };
  withInsurance: { title: string; lines: string[]; total: string; note?: string };
  highlight: string;
};
export type ProductCase = {
  kicker: string;
  title: string;
  scenario: string;
  analysis: string;
  settlement: CaseSettlement;
};

export type Benefit = { eyebrow: string; title: string; text: string };

export type ProductDutyData = {
  slug: string;
  name: string;
  tagline: string;
  heroSummary: string;
  benefits: Benefit[];
  responsibilities: Responsibility[];
  drugClasses: DrugClass[];
  drugs: Drug[];
  hospitalClasses: HospitalClass[];
  hospitals: Hospital[];
  full: FullSection[];
  cases: ProductCase[];
  /** 展业查询页脚注：说明数据口径与官方清单入口 */
  advisorNote: string;
  consult: { title: string; text: string; image: string };
  disclaimer: string;
};

export const productDuty: Record<string, ProductDutyData> = {
  "zhixuan-yisheng": {
    slug: "zhixuan-yisheng",
    name: "智选逸生",
    tagline: "一份把「医保之外的大额医疗支出」讲清楚的中高端医疗保障",
    heroSummary:
      "五大保障打底（一般/重疾医疗、质子重离子、CAR-T、住院津贴），四项可选责任按需组合，用客户能看懂的语言梳理：这项责任解决什么问题、赔多少、怎么赔。",
    benefits: [
      {
        eyebrow: "01 · 五大保障",
        title: "基本责任A覆盖五项保障",
        text: "一般/重大疾病医疗、质子重离子医疗、恶性肿瘤CAR-T疗法院外药品费、特别住院津贴。保险期间累计给付限额 500 万元，一般医疗年度免赔额仅 5000 元，重疾/质子重离子/CAR-T 0 免赔。",
      },
      {
        eyebrow: "02 · 药械广",
        title: "可选药械责任覆盖更全",
        text: "院外一般药械（0 免赔、80%、10 万，无白名单）、院外特定药械（0 免赔、100%、400 万，含恶性肿瘤特药 256 种、罕见病药 41 种、临床急需进口药、特种器械）、全球特药海外医疗（0 免赔、100%、400 万）。",
      },
      {
        eyebrow: "03 · 体验佳",
        title: "可选扩展特需 / 国际部",
        text: "住院范围扩展至二级或以上医保定点医院的普通部、特需部、国际部，床位费限 1500 元/天；另有 30+ 家医院特需/国际部住院直付服务。",
      },
    ],
    responsibilities: [
      {
        key: "general-hospital",
        title: "普通住院保障",
        contract: "基本责任A ·（一）一般医疗费用补偿金",
        group: "普通住院保障",
        required: true,
        problem: "普通疾病或意外住院时，医保结算后仍需个人承担的部分（床位、手术、检查、药品等）。",
        chips: [
          { label: "年度免赔额", value: "5000元" },
          { label: "赔付比例", value: "100%" },
          { label: "累计限额", value: "200万", tone: "brand" },
        ],
        details: [
          "住院费用：床位、膳食、护理、诊疗、检查检验、药品、治疗、救护车等",
          "住院手术费：常规手术、内置/外置医疗设备",
          "指定门急诊：住院前后30天、门急诊手术、恶性肿瘤特殊门急诊、肾透析、抗排异",
          "手术后出院再次住院：赔付比例 80%",
        ],
      },
      {
        key: "major-disease",
        title: "大病治疗保障",
        contract: "基本责任A ·（二）重大疾病医疗费用补偿金",
        group: "大病治疗保障",
        required: true,
        problem: "确诊重大疾病后的高额住院与治疗费用——重大疾病场景下 0 免赔、起赔更快。",
        chips: [
          { label: "免赔额", value: "0元" },
          { label: "赔付比例", value: "100%" },
          { label: "累计限额", value: "400万", tone: "brand" },
        ],
        details: [
          "住院费用：床位、膳食、护理、诊疗、检查检验、药品、治疗、救护车、重症监护等",
          "住院手术费：常规手术、内置/外置医疗设备",
          "指定门急诊：住院前后30天、门急诊手术、恶性肿瘤特殊门急诊、肾透析、抗排异",
          "手术后出院再次住院：赔付比例 80%",
        ],
      },
      {
        key: "proton",
        title: "质子重离子治疗",
        contract: "基本责任A ·（三）质子重离子医疗费用补偿金",
        group: "高端医疗资源",
        required: true,
        problem: "癌症精准放疗（质子重离子）单疗程费用通常较高，医保大多不覆盖。",
        chips: [
          { label: "免赔额", value: "0元" },
          { label: "赔付比例", value: "100%" },
          { label: "累计限额", value: "400万", tone: "brand" },
        ],
        details: ["在保险合同指定的质子重离子治疗医院接受治疗的相关费用"],
        related: ["proton"],
      },
      {
        key: "cart",
        title: "CAR-T 细胞免疫治疗",
        contract: "基本责任A ·（四）恶性肿瘤CAR-T疗法院外药品费补偿金",
        group: "创新药械支持",
        required: true,
        problem: "CAR-T 一针动辄上百万元，且多为院外购药，商业保险常不覆盖。",
        chips: [
          { label: "免赔额", value: "0元" },
          { label: "赔付比例", value: "100%" },
          { label: "累计限额", value: "400万", tone: "brand" },
        ],
        details: ["在保险合同指定的CAR-T治疗医院使用约定药品的相关费用"],
        related: ["cart", "cart-hospital"],
      },
      {
        key: "icu-allowance",
        title: "重症住院津贴",
        contract: "基本责任A ·（五）特别住院津贴保险金",
        group: "普通住院保障",
        required: true,
        problem: "重症监护病房（ICU）住院期间的额外支出。",
        chips: [
          { label: "给付标准", value: "1000元/天" },
          { label: "给付上限", value: "180天" },
          { label: "累计限额", value: "18万", tone: "brand" },
        ],
        details: ["在二级或以上医院重症监护病房住院期间给付，每日 1000 元"],
      },
      {
        key: "exclusive-international",
        title: "特需 / 国际部医疗",
        contract: "可选责任1 · 扩展特需/国际部医疗费用补偿金",
        group: "高端医疗资源",
        problem: "希望到三甲医院特需部、国际部就医，减少排队等待。",
        chips: [
          { label: "免赔额", value: "0元" },
          { label: "床位费", value: "1500元/天" },
          { label: "累计限额", value: "400万", tone: "brand" },
        ],
        details: [
          "住院范围扩展至二级或以上医保定点医院的高端病房、高端门急诊（特需部、国际部等）",
          "分计划D / 计划E 两档，二者互斥，需选择其一",
          "计划D：赔付比例 80%（自付超 5 万元部分 100%）",
          "计划E：区域A 80%（超5万部分100%）；区域B 60%",
        ],
        related: ["direct-abcd", "direct-e"],
      },
      {
        key: "specific-outside-drug",
        title: "院外特药与创新治疗支持",
        contract: "可选责任2 · 院外特定药械费用补偿金",
        group: "创新药械支持",
        problem: "癌症、罕见病等治疗中，靶向药、进口药、创新器械多为院外购买且费用高昂。",
        chips: [
          { label: "免赔额", value: "0元" },
          { label: "赔付比例", value: "100%" },
          { label: "累计限额", value: "400万", tone: "brand" },
        ],
        details: [
          "恶性肿瘤院外特定药品（256种）",
          "临床急需进口药品：海南博鳌（50种）、大湾区（11种）",
          "罕见病院外特定药品（41种）",
          "特种医疗器械（3种）",
          "恶性肿瘤特定药品基因检测费（限额 2 万）",
        ],
        related: ["malignant", "import-boao", "import-gba", "rare", "device"],
      },
      {
        key: "general-outside-drug",
        title: "院外一般药械与送药",
        contract: "可选责任3 · 院外一般药械及送药费用补偿金",
        group: "创新药械支持",
        problem: "普通慢病药、普药与常用器械的院外购药支持，无药械白名单。",
        chips: [
          { label: "免赔额", value: "0元" },
          { label: "赔付比例", value: "80%" },
          { label: "累计限额", value: "10万", tone: "brand" },
        ],
        details: ["院外一般药械费：遵医嘱在院外购买的一般药械", "院外送药费：符合约定的送药服务费用"],
      },
      {
        key: "global-special-drug",
        title: "全球特药与海外医疗",
        contract: "可选责任4 · 全球特药海外医疗费用补偿金",
        group: "海外医疗支持",
        problem: "部分新药国内未上市，需要海外就医。",
        chips: [
          { label: "免赔额", value: "0元" },
          { label: "赔付比例", value: "100%" },
          { label: "累计限额", value: "400万", tone: "brand" },
        ],
        details: [
          "海外就医医疗费用",
          "赴境外就医交通费用",
          "境外就医期间住宿费用",
          "符合约定的遗体返还费用",
        ],
      },
    ],
    drugClasses: [
      { id: "malignant", name: "恶性肿瘤特定药品", count: 256, note: "院外靶向药及其他肿瘤用药" },
      { id: "cart", name: "CAR-T 药品", count: 5 },
      { id: "import-boao", name: "临床急需进口药品 · 海南博鳌", count: 50 },
      { id: "import-gba", name: "临床急需进口药品 · 大湾区", count: 11 },
      { id: "rare", name: "罕见病特定药品", count: 41 },
      { id: "device", name: "特种医疗器械", count: 3 },
    ],
    drugs: [
      { name: "可瑞达", brand: "帕博利珠单抗", category: "malignant", purpose: "PD-1 免疫治疗，多种实体瘤" },
      { name: "欧狄沃", brand: "纳武利尤单抗", category: "malignant", purpose: "PD-1 免疫治疗，非小细胞肺癌等" },
      { name: "英飞凡", brand: "度伐利尤单抗", category: "malignant", purpose: "PD-L1 免疫治疗，肺癌等" },
      { name: "安维汀", brand: "贝伐珠单抗", category: "malignant", purpose: "抗血管生成，结直肠癌等" },
      { name: "伊基奥仑赛注射液", brand: "福可苏", category: "cart", purpose: "CAR-T，多发性骨髓瘤" },
      { name: "阿基仑赛注射液", brand: "奕凯达", category: "cart", purpose: "CAR-T，大B细胞淋巴瘤等" },
      { name: "瑞基奥仑赛注射液", brand: "倍诺达", category: "cart", purpose: "CAR-T，滤泡性淋巴瘤等" },
      { name: "Arzerra", brand: "奥法妥木单抗", category: "import-boao", purpose: "CLL/SLL（海南博鳌先行区）" },
      { name: "Balversa", brand: "厄达替尼", category: "import-boao", purpose: "尿路上皮癌（海南博鳌先行区）" },
      { name: "Bavencio", brand: "阿维鲁单抗", category: "import-boao", purpose: "皮肤/尿路上皮癌（海南博鳌先行区）" },
      { name: "Bosulif", brand: "博舒替尼", category: "import-boao", purpose: "慢性髓性白血病（海南博鳌先行区）" },
      { name: "Erivedge", brand: "维莫德吉胶囊", category: "import-gba", purpose: "基底细胞癌（大湾区）" },
      { name: "Cabometyx", brand: "卡博替尼", category: "import-gba", purpose: "肾细胞癌等（大湾区）" },
      { name: "Piqray", brand: "阿培利司", category: "import-gba", purpose: "乳腺癌（大湾区）" },
      { name: "Yervoy", brand: "伊匹木单抗", category: "import-gba", purpose: "免疫治疗（大湾区）" },
      { name: "海芮思", brand: "艾度硫酸酯酶β注射液", category: "rare", purpose: "黏多糖贮积症" },
      { name: "艾而赞", brand: "拉罗尼酶", category: "rare", purpose: "黏多糖贮积症 I 型" },
      { name: "瑞普佳", brand: "阿加糖酶α", category: "rare", purpose: "法布雷病" },
      { name: "思而赞", brand: "伊米苷酶", category: "rare", purpose: "戈谢病" },
      { name: "植入性鞘内药物输注系统", category: "device", purpose: "难治性癌痛的输注系统" },
      { name: "乳房假体", category: "device", purpose: "乳房一期再造" },
      { name: "组配式假体系统", category: "device", purpose: "恶性肿瘤骨缺损重建" },
    ],
    hospitalClasses: [
      { id: "proton", name: "质子重离子治疗医院", count: 9 },
      { id: "direct-abcd", name: "直付住院优选医院（计划A/B/C/D）", count: 39 },
      { id: "direct-e", name: "直付住院优选医院（计划E）", count: 25 },
      { id: "cart-hospital", name: "CAR-T 认可医疗机构", count: 221 },
    ],
    hospitals: [
      { name: "华中科技大学同济医学院附属同济医院", category: "proton", city: "武汉" },
      { name: "华中科技大学同济医学院附属协和医院", category: "proton", city: "武汉" },
      { name: "上海市质子重离子医院（复旦大学附属肿瘤医院质子重离子中心）", category: "proton", city: "上海" },
      { name: "上海交通大学医学院附属瑞金医院肿瘤质子中心", category: "proton", city: "上海" },
      { name: "淄博万杰肿瘤医院", category: "proton", city: "山东" },
      { name: "华中科技大学同济医学院附属同济医院国际医疗部", category: "direct-abcd", city: "武汉" },
      { name: "武汉大学中南医院（干部特需门诊）", category: "direct-abcd", city: "武汉" },
      { name: "首都医科大学附属北京友谊医院国际医疗中心", category: "direct-abcd", city: "北京" },
      { name: "上海交通大学医学院附属瑞金医院国际医疗部", category: "direct-abcd", city: "上海" },
      { name: "中山大学附属第一医院特需医疗中心", category: "direct-abcd", city: "广州" },
      { name: "山东第一医科大学附属省立医院国际医疗部", category: "direct-e", city: "济南" },
      { name: "河南省人民医院国际医疗中心", category: "direct-e", city: "郑州" },
      { name: "浙江大学医学院附属第一医院国际医疗门诊部", category: "direct-e", city: "杭州" },
      { name: "湖北省内认可医院（含武汉地区多家三甲）", category: "cart-hospital", city: "湖北" },
    ],
    full: [
      {
        id: "basic-a",
        title: "基本责任A · 五大保障",
        intro:
          "基本责任A 为一揽子必选保障，涵盖一般医疗、重大疾病医疗、质子重离子、恶性肿瘤CAR-T疗法院外药品费与特别住院津贴五项责任。",
        groups: [
          {
            title: "(一) 一般医疗费用补偿金",
            chips: [
              { label: "年度免赔额", value: "5000元" },
              { label: "赔付比例", value: "100%" },
              { label: "累计给付限额", value: "200万", tone: "brand" },
            ],
            headers: ["保险责任项目", "覆盖内容", "每项累计给付限额"],
            rows: [
              ["1、住院费用补偿金", "床位费、膳食费、护理费、医生诊疗费、检查检验费、药品费、治疗费、救护车使用费及重症监护病房费", "200万"],
              ["2、住院手术 · 常规手术费", "住院期间符合约定的手术费用", "200万"],
              ["2、住院手术 · 内置医疗设备费", "住院期间使用内置医疗设备费用", "200万"],
              ["2、住院手术 · 外置医疗设备费", "住院期间使用外置医疗设备费用", "3万"],
              ["3、指定门急诊 · 住院前后门急诊费", "住院前后 30 天（含出院当天）指定门急诊", "200万"],
              ["3、指定门急诊 · 门急诊手术费", "符合约定的门急诊手术费用", "200万"],
              ["3、指定门急诊 · 恶性肿瘤特殊门急诊费", "恶性肿瘤相关特殊门急诊治疗", "200万"],
              ["3、指定门急诊 · 肾透析门急诊费", "肾透析相关门急诊治疗", "200万"],
              ["3、指定门急诊 · 抗排异治疗门急诊费", "器官移植后的抗排异治疗门急诊", "200万"],
              ["4、手术后出院再次住院费用补偿金", "手术后因相关原因出院后再住院", "2万", { text: "80%", tone: "olive" }],
            ],
            note: "本组各子项累计给付限额合计不超 200 万；手术后再次住院费用补偿金赔付比例为 80%。",
          },
          {
            title: "(二) 重大疾病医疗费用补偿金",
            chips: [
              { label: "年度免赔额", value: "0元" },
              { label: "赔付比例", value: "100%" },
              { label: "累计给付限额", value: "400万", tone: "brand" },
            ],
            headers: ["保险责任项目", "覆盖内容", "每项累计给付限额"],
            rows: [
              ["1、住院费用补偿金", "同一般医疗包含项目（床位、膳食、护理、诊疗、检查检验、药品、治疗、救护车、重症监护等）", "400万"],
              ["2、住院手术 · 常规手术费", "住院期间符合约定的手术费用", "400万"],
              ["2、住院手术 · 内置医疗设备费", "住院期间使用内置医疗设备费用", "400万"],
              ["2、住院手术 · 外置医疗设备费", "住院期间使用外置医疗设备费用", "3万"],
              ["3、指定门急诊 · 住院前后门急诊费", "住院前后 30 天（含出院当天）指定门急诊", "400万"],
              ["3、指定门急诊 · 门急诊手术费", "符合约定的门急诊手术费用", "400万"],
              ["3、指定门急诊 · 恶性肿瘤特殊门急诊费", "恶性肿瘤相关特殊门急诊治疗", "400万"],
              ["3、指定门急诊 · 肾透析门急诊费", "肾透析相关门急诊治疗", "400万"],
              ["3、指定门急诊 · 抗排异治疗门急诊费", "器官移植后的抗排异治疗门急诊", "400万"],
              ["4、手术后出院再次住院费用补偿金", "手术后因相关原因出院后再住院", "2万", { text: "80%", tone: "olive" }],
            ],
            note: "本组各子项累计给付限额合计不超 400 万；手术后再次住院费用补偿金赔付比例为 80%。",
          },
          {
            title: "(三) 质子重离子医疗费用补偿金",
            chips: [
              { label: "年度免赔额", value: "0元" },
              { label: "赔付比例", value: "100%" },
              { label: "累计给付限额", value: "400万", tone: "brand" },
            ],
            headers: ["保险责任项目", "覆盖内容", "累计给付限额"],
            rows: [["质子重离子医疗费用", "在保险合同指定的质子重离子治疗医院接受治疗的相关费用", "400万"]],
          },
          {
            title: "(四) 恶性肿瘤CAR-T疗法院外药品费补偿金",
            chips: [
              { label: "年度免赔额", value: "0元" },
              { label: "赔付比例", value: "100%" },
              { label: "累计给付限额", value: "400万", tone: "brand" },
            ],
            headers: ["保险责任项目", "覆盖内容", "累计给付限额"],
            rows: [["CAR-T疗法院外药品费", "在保险合同指定的CAR-T治疗医院使用约定药品的相关费用", "400万"]],
          },
          {
            title: "(五) 特别住院津贴保险金",
            chips: [
              { label: "给付标准", value: "1000元/天" },
              { label: "给付上限", value: "180天" },
              { label: "累计给付限额", value: "18万", tone: "brand" },
            ],
            headers: ["保险责任项目", "覆盖内容", "累计给付限额"],
            rows: [["特别住院津贴", "在二级或以上医院重症监护病房住院期间给付，每日 1000 元", "18万"]],
          },
        ],
        footnotes: [
          "医院范围包括：(1) 二级或以上医院普通病房、普通门急诊；(2) 康复医院或二级或以上医院普通病房（手术后再次住院费用）；(3) 保险合同指定的质子重离子治疗医院；(4) 保险合同指定的CAR-T治疗医院；(5) 二级或以上医院重症监护病房（特别住院津贴）。",
          "住院费用/住院手术费用/指定门急诊费用，若以有公费医疗或基本医保身份投保但就诊未使用医保结算，赔付比例降为 80%。",
        ],
      },
      {
        id: "optional-1",
        title: "可选责任1 · 扩展特需/国际部医疗费用补偿金",
        intro: "将住院范围扩展至二级或以上医保定点医院的高端病房、高端门急诊（特需部、国际部等），0 免赔，床位费限 1500 元/天。",
        groups: [
          {
            title: "扩展特需/国际部医疗费用补偿金（计划 D / 计划 E）",
            chips: [
              { label: "年度免赔额", value: "0元" },
              { label: "累计给付限额", value: "400万", tone: "brand" },
            ],
            headers: ["保险责任项目", "计划 D 每项累计给付", "计划 E 每项累计给付"],
            rows: [
              ["1、住院费用补偿金（床位费及膳食费、护理费、医生诊疗费等）", "限1500元/天 · 400万", "限1500元/天 · 400万"],
              ["2、住院手术 · 常规手术费", "400万", "400万"],
              ["2、住院手术 · 内置医疗设备费", "400万", "400万"],
              ["2、住院手术 · 外置医疗设备费", "3万", "3万"],
              ["3、指定门急诊 · 住院前后门急诊费", "400万", "400万"],
              ["3、指定门急诊 · 门急诊手术费", "400万", "400万"],
              ["3、指定门急诊 · 恶性肿瘤特殊门急诊费", "400万", "400万"],
              ["3、指定门急诊 · 肾透析门急诊费", "400万", "400万"],
              ["3、指定门急诊 · 抗排异治疗门急诊费", "400万", "400万"],
              ["赔付比例", { text: "计划D：80%（自付金额高于5万元时，超过部分赔付比例为100%）", tone: "olive" }, { text: "计划E：区域A（除北京、上海、江苏、广东(含深圳)以外地区）80%，自付超5万元部分100%；区域B（北京、上海、江苏、广东(含深圳)）60%", tone: "olive" }],
            ],
          },
        ],
        footnotes: [
          "医院范围：具有基本医疗保险定点资格并经国家卫生行政部门认定的二级或以上医院高端病房、高端门急诊。",
          "本费率页面中可选责任 1 分为计划 D 与计划 E 两个档位，二者互斥，需选择其一。",
        ],
      },
      {
        id: "optional-2",
        title: "可选责任2 · 院外特定药械费用补偿金",
        intro: "覆盖 300+ 种恶性肿瘤特定药品、临床急需进口药品、罕见病特定药品与特种医疗器械，0 免赔、100% 赔付，累计给付限额 400 万。",
        groups: [
          {
            title: "院外特定药械费用补偿金",
            chips: [
              { label: "免赔额", value: "0元" },
              { label: "赔付比例", value: "100%" },
              { label: "累计给付限额", value: "400万", tone: "brand" },
            ],
            headers: ["保险责任项目", "覆盖内容", "每项累计给付限额"],
            rows: [
              ["1、恶性肿瘤院外特定药品费", "遵医嘱在院外购买的恶性肿瘤特定药品", "400万"],
              ["2、恶性肿瘤临床急需进口药品费", "国内已上市但临床急需的进口药品", "400万"],
              ["3、恶性肿瘤院外特种医疗器械费", "符合约定的院外特种医疗器械", "400万"],
              ["4、恶性肿瘤特定药品基因检测费", "用于特定药品使用的基因检测", "2万"],
              ["5、罕见病院外特定药品费", "罕见病相关的院外特定药品", "400万"],
            ],
          },
        ],
        footnotes: ["涵盖范围以保险合同约定的药品清单、器械清单及责任定义为准。"],
      },
      {
        id: "optional-3",
        title: "可选责任3 · 院外一般药械及送药费用补偿金",
        intro: "覆盖院外一般药械费与院外送药费，无药械白名单，普药、慢病药、医疗器械均可纳入；0 免赔、赔付比例 80%，累计给付限额 10 万元。",
        groups: [
          {
            title: "院外一般药械及送药费用补偿金",
            chips: [
              { label: "免赔额", value: "0元" },
              { label: "赔付比例", value: "80%" },
              { label: "累计给付限额", value: "10万", tone: "brand" },
            ],
            headers: ["保险责任项目", "覆盖内容", "每项累计给付限额"],
            rows: [
              ["1、院外一般药械费", "遵医嘱在院外购买的一般药械费用", "10万"],
              ["2、院外送药费", "符合约定的院外送药服务费用", "10万"],
            ],
          },
        ],
        footnotes: ["院外购药须符合合同约定，并以医生处方和实际费用凭证为准。"],
      },
      {
        id: "optional-4",
        title: "可选责任4 · 全球特药海外医疗费用补偿金",
        intro: "覆盖海外就医产生的医疗、交通、住宿及遗体返还费用，0 免赔、100% 赔付，累计给付限额 400 万。",
        groups: [
          {
            title: "全球特药海外医疗费用补偿金",
            chips: [
              { label: "免赔额", value: "0元" },
              { label: "赔付比例", value: "100%" },
              { label: "累计给付限额", value: "400万", tone: "brand" },
            ],
            headers: ["保险责任项目", "覆盖内容", "每项累计给付限额"],
            rows: [
              ["1、医疗费用", "海外就医产生的约定医疗费用", "400万"],
              ["2、交通费用", "赴境外就医的交通费用", "400万"],
              ["3、住宿费用", "境外就医期间的住宿费用", "400万"],
              ["4、遗体返还费用", "符合约定的遗体返还相关费用", "400万"],
            ],
          },
        ],
        footnotes: ["海外就医安排与费用给付以保险合同约定及保险公司审核为准。"],
      },
    ],
    cases: [
      {
        kicker: "案例 01 · 一般医疗",
        title: "住院手术，免赔额怎么抵扣",
        scenario:
          "被保人因急性阑尾炎住院手术，总费用 28,000 元，经医保结算后个人承担 12,000 元（均为医保范围内合理费用）。",
        analysis:
          "一般医疗费用补偿金按年度免赔额 5000 元抵扣，超免赔部分按约定比例赔付。先算个人承担金额，再扣除免赔额、乘以赔付比例，即为示例赔付。案例仅用于理解责任结构，不代表固定赔付结果。",
        settlement: {
          heading: "阑尾炎住院手术费用测算",
          expenses: [
            { label: "总医疗费用", value: "28,000元" },
            { label: "医保报销", value: "−16,000元" },
            { label: "医保后自付", value: "12,000元", accent: true },
          ],
          withoutInsurance: { title: "没有保险", lines: ["全部个人承担费用由家庭支出"], total: "需承担 12,000元" },
          withInsurance: {
            title: "智选逸生（基本责任A · 一般医疗）",
            lines: ["年度免赔额：5,000元", "免赔后金额：12,000 − 5,000 = 7,000元", "赔付比例 100%：约 7,000元"],
            total: "预计赔付约 7,000元",
            note: "家庭预计承担约 5,000元（即免赔额部分）",
          },
          highlight: "保障亮点：一般医疗年度免赔额仅 5000 元，超免赔部分按 100% 给付。",
        },
      },
      {
        kicker: "案例 02 · 重大疾病 + 可选责任",
        title: "恶性肿瘤，院外特药怎么赔",
        scenario:
          "被保人确诊恶性肿瘤，住院手术治疗产生费用 120,000 元，并遵医嘱在院外购买特定抗癌药品 80,000 元（属可选责任2覆盖范围）。",
        analysis:
          "重大疾病医疗费用补偿金 0 免赔、100% 赔付；院外特定药械作为可选责任，0 免赔、100% 赔付。两项责任需分别核对责任范围与累计限额，再计算示例赔付。",
        settlement: {
          heading: "恶性肿瘤治疗费用测算",
          expenses: [
            { label: "住院及治疗费用", value: "120,000元" },
            { label: "院外特定抗癌药品", value: "80,000元", accent: true },
            { label: "合计", value: "200,000元" },
          ],
          withoutInsurance: { title: "没有保险", lines: ["住院手术 + 院外特药全部自费"], total: "需承担 200,000元" },
          withInsurance: {
            title: "智选逸生（基本责任A + 可选责任2）",
            lines: ["重大疾病医疗费用补偿金（0免赔、100%）：120,000元", "院外特定药械费用补偿金（0免赔、100%）：80,000元"],
            total: "预计赔付约 200,000元",
            note: "责任范围内自付大幅减少，具体以真实费用、合同与审核为准",
          },
          highlight: "保障亮点：重疾 0 免赔，叠加可选责任2 覆盖院外特定药械，大病用药更从容。",
        },
      },
    ],
    advisorNote:
      "药品/医院清单以友邦官网披露为准：本工具收录官网公开清单中的代表性条目，完整 256 种恶性肿瘤特药、50 种海南博鳌、11 种大湾区、41 种罕见病药及医院明细请在下方官方入口查看最新版本。",
    consult: {
      title: "把保障需求先梳理清楚",
      text: "扫码添加方仲达，结合医保、已有保单与家庭预算进行一对一保障梳理。",
      image: "/assets/images/products/youtongxing/image-4028bb025c8c.jpg",
    },
    disclaimer:
      "本页面仅用于保险知识普及，不构成销售承诺、保险合同、利益保证或个性化投保建议。产品名称、保险责任、责任免除、医院范围、等待期、续保条件、给付比例、费用及服务内容均以正式保险合同、最新产品资料和保险公司审核为准。",
  },

  "youtongxing": {
    slug: "youtongxing",
    name: "友童行",
    tagline: "孩子日常磕碰、住院治疗与校园出行风险，一张图看懂保什么",
    heroSummary:
      "用更容易理解的方式，梳理儿童意外门诊、疾病住院和医保目录外费用风险。三块责任分别回应儿童家庭中更常见的门诊、住院和住院期间支出。",
    benefits: [
      {
        eyebrow: "01 · 意外门诊",
        title: "小意外也能用得上",
        text: "符合合同约定的意外医药费用，给付限额 1 万元，不限医保范围。",
      },
      {
        eyebrow: "02 · 疾病住院",
        title: "医保内外分层承担",
        text: "住院费用责任包含医保范围内及符合合同约定的目录外费用。",
      },
      {
        eyebrow: "03 · 住院津贴",
        title: "补充住院期间支出",
        text: "意外住院日额津贴 100 元/天，具体免赔天数与累计上限以合同为准。",
      },
    ],
    responsibilities: [
      {
        key: "accident-medical",
        title: "意外医药费用",
        contract: "友童行意外伤害保险 · 意外医药费用补偿金",
        group: "意外保障",
        required: true,
        problem: "孩子摔伤、磕碰等意外后的门急诊医药费用，不限医保范围。",
        chips: [
          { label: "给付限额", value: "1万" },
          { label: "医保要求", value: "不限" },
          { label: "赔付次数", value: "不限" },
        ],
        details: [
          "符合合同约定的意外医药费用",
          "已使用医保结算：赔付比例 100%",
          "未使用医保结算：赔付比例 80%",
        ],
      },
      {
        key: "accident-death-disability",
        title: "意外身故 / 伤残",
        contract: "友童行意外伤害保险 · 意外事故保险金",
        group: "意外保障",
        required: true,
        problem: "意外身故或伤残给家庭带来的收入缺口与照护成本。",
        chips: [
          { label: "一般意外", value: "10万" },
          { label: "航空意外", value: "100万" },
          { label: "预防接种", value: "20万" },
        ],
        details: [
          "一般意外事故保险金：身故/伤残，给付限额 10 万",
          "航空意外事故保险金：身故/伤残，给付限额 100 万",
          "特定意外事故保险金：水陆公共交通工具、校车、学校及九种重大自然灾害情形，10 万",
          "意外Ⅲ度烧伤保险金：符合约定烧伤程度和面积，给付比例 20% / 100%",
          "预防接种事故保险金：身故/伤残，给付限额 20 万",
        ],
      },
      {
        key: "accident-allowance",
        title: "意外住院津贴",
        contract: "友童行意外伤害保险 · 意外住院日额津贴保险金",
        group: "意外保障",
        required: true,
        problem: "孩子意外住院期间的家庭支出补偿。",
        chips: [
          { label: "给付标准", value: "100元/天" },
          { label: "单次上限", value: "30天" },
          { label: "年度上限", value: "180天" },
        ],
        details: ["同一意外住院原因免赔 3 天，给付 30 天为限", "保险期间内累计给付 180 天为限"],
      },
      {
        key: "disease-hospital",
        title: "疾病住院保障",
        contract: "友邦附加友童行住院费用补偿医疗保险",
        group: "普通住院保障",
        required: true,
        problem: "孩子因疾病住院，医保结算后个人仍需承担的费用。",
        chips: [
          { label: "给付限额", value: "2万" },
          { label: "免赔额", value: "100元" },
          { label: "赔付次数", value: "不限" },
        ],
        details: [
          "医保范围内 · 已使用医保：赔付比例 100%",
          "医保范围内 · 未使用医保：赔付比例 80%",
          "符合合同约定的医保目录外住院费用：赔付比例 70%",
          "同一住院原因免赔额 100 元",
        ],
      },
    ],
    drugClasses: [],
    drugs: [],
    hospitalClasses: [],
    hospitals: [],
    full: [
      {
        id: "plan-accident",
        title: "友邦友童行意外伤害保险",
        intro: "主险：意外身故/伤残、Ⅲ度烧伤、预防接种事故与意外医药费用、意外住院津贴。",
        groups: [
          {
            title: "责任明细",
            headers: ["责任项目", "给付内容", "给付限额 / 比例"],
            rows: [
              ["1、一般意外事故保险金", "身故 / 伤残", "10万"],
              ["2、航空意外事故保险金", "身故 / 伤残", "100万"],
              ["3、特定意外事故保险金", "身故 / 伤残（水陆公共交通工具、校车、学校、九种重大自然灾害）", "10万"],
              ["4、意外Ⅲ度烧伤保险金", "符合约定烧伤程度和面积，给付比例 20% / 100%", "10万"],
              ["5、预防接种事故保险金", "身故 / 伤残", "20万"],
              ["6、意外医药费用补偿金", "已使用医保 100% / 未使用医保 80%", "1万"],
              ["7、意外住院日额津贴保险金", "100 元/天；同一意外住院原因免赔 3 天，给付 30 天为限；保险期间内累计 180 天为限", "—"],
            ],
          },
        ],
      },
      {
        id: "plan-hospital",
        title: "友邦附加友童行住院费用补偿医疗保险",
        intro: "附加险：医保内外分层承担的住院费用补偿。",
        groups: [
          {
            title: "责任明细",
            headers: ["责任项目", "给付内容", "给付限额 / 比例"],
            rows: [
              ["住院费用补偿保险金", "医保内 · 已使用医保 100% / 未使用医保 80%；医保目录外符合约定 70%；同一住院原因免赔 100 元", "2万"],
            ],
          },
        ],
      },
    ],
    cases: [
      {
        kicker: "案例 01 · 疾病住院",
        title: "肺炎住院 7 天",
        scenario: "总费用 12,000 元，医保结算后个人承担 5,000 元，其中包含医保目录外费用。",
        analysis: "把账单拆成医保内、医保外和已由医保承担三部分，再按照住院免赔额与约定比例逐项计算。",
        settlement: {
          heading: "肺炎住院费用测算",
          expenses: [
            { label: "总医疗费用", value: "12,000元" },
            { label: "医保报销", value: "−7,000元" },
            { label: "医保后自付", value: "5,000元", accent: true },
          ],
          withoutInsurance: { title: "没有保险", lines: ["全部费用由家庭承担"], total: "需承担 5,000元" },
          withInsurance: {
            title: "友邦友童行（住院费用补偿医疗保险）",
            lines: ["免赔额：100元", "医保范围内（100%）：约3,900元", "医保范围外（70%）：约700元"],
            total: "预计赔付约4,600元",
            note: "家庭预计承担约400元",
          },
          highlight: "保障亮点：医保内外分层计算，住院费用报销比例清晰。",
        },
      },
      {
        kicker: "案例 02 · 意外受伤",
        title: "骑车摔伤骨折",
        scenario: "意外导致门急诊检查、治疗，并因伤住院，产生门诊、住院和陪护等多类支出。",
        analysis: "分别核对意外医药、住院医疗与住院津贴三项责任，避免把门诊费用和住院费用混在同一个限额中理解。",
        settlement: {
          heading: "骑车摔伤费用测算",
          expenses: [
            { label: "医疗费用总额", value: "8,000元" },
            { label: "医保报销", value: "−5,500元" },
            { label: "医保后自付", value: "2,500元", accent: true },
          ],
          withoutInsurance: { title: "没有保险", lines: ["医疗自付部分无额外补贴"], total: "需承担 2,500元" },
          withInsurance: {
            title: "友邦友童行（意外伤害保险）",
            lines: ["意外医疗保险金：2,500元（示例按100%）", "住院津贴：100元 / 天 × 5天 = 500元", "如评定10%伤残：10万元 × 10% = 1万元"],
            total: "责任可分别核对",
            note: "伤残保险金以实际评定与审核为准",
          },
          highlight: "保障亮点：意外医疗、住院津贴与伤残 / 身故责任分别计算。",
        },
      },
    ],
    advisorNote:
      "友童行为儿童意外 + 住院医疗组合产品，暂无官网披露的药品/医院清单。展业查询聚焦责任明细与赔付比例。",
    consult: {
      title: "先把孩子的现有保障梳理清楚",
      text: "扫码添加方仲达，结合医保、已有保单与家庭预算进行一对一保障梳理。",
      image: "/assets/images/products/youtongxing/image-4028bb025c8c.jpg",
    },
    disclaimer:
      "本页面仅用于保险知识普及，不构成销售承诺、保险合同、利益保证或个性化投保建议。产品名称、保险责任、责任免除、医院范围、等待期、续保条件、给付比例、费用及服务内容均以正式保险合同、最新产品资料和保险公司审核为准。",
  },
};

export function getProductDuty(slug: string): ProductDutyData | undefined {
  return productDuty[slug];
}
