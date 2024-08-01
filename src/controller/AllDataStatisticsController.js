const axios = require("axios");

let getAllDataStaisticsPage = async function (req, res) {
  try {
    let Commercialoptions = {
      method: "get",
      url: "https://commercial-backend-git-main-saboo-commercials-projects.vercel.app/alldata",
    };
    let Nexaoption = {
      method: "get",
      url: "https://nexa-backend-git-main-saboo-nexas-projects.vercel.app/allData",
    };
    let Arenaoption = {
      method: "get",
      url: "https://arena-backend-git-main-arenas-projects.vercel.app//allData",
    };
    let autozoneOptions = {
      method: "get",
      url: "https://autozone-backend.onrender.com/allData",
    };

    let CommercialResult = await axios(Commercialoptions);
    let NexaResult = await axios(Nexaoption);
    let ArenaResult = await axios(Arenaoption);
    let AutozoneResult = await axios(autozoneOptions);

    let nexaData = NexaResult.data;
    let Commercialdata = CommercialResult.data;
    let ArenaData = ArenaResult.data;
    let autozoneData = AutozoneResult.data;

    const getMonthlyData = (data, label) => {
      let monthlyCounts = Array(12).fill(0);
      data.forEach((lead) => {
        let date = new Date(lead.date);
        let month = date.getMonth();
        monthlyCounts[month]++;
      });

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      let monthlyData = [];
      for (let i = 0; i <= currentMonth; i++) {
        let monthLabel = `${months[i]}${currentYear}`;
        let monthData = monthlyData.find((data) => data.Month === monthLabel);
        if (!monthData) {
          monthData = { Month: monthLabel };
          monthlyData.push(monthData);
        }
        monthData[label] = monthlyCounts[i];
      }

      return monthlyData;
    };

    const getCurrentAndPreviousMonthCounts = (data) => {
      const currentMonth = new Date().getMonth();
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const currentMonthYear = new Date().getFullYear();
      const previousMonthYear =
        previousMonth === 11 ? currentMonthYear - 1 : currentMonthYear;

      let currentMonthCount = 0;
      let previousMonthCount = 0;

      data.forEach((lead) => {
        let date = new Date(lead.date);
        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentMonthYear
        ) {
          currentMonthCount++;
        } else if (
          date.getMonth() === previousMonth &&
          date.getFullYear() === previousMonthYear
        ) {
          previousMonthCount++;
        }
      });

      return {
        currentMonthCount,
        previousMonthCount,
      };
    };

    let autozoneMonthlyData = getMonthlyData(autozoneData.data, "Autozone");
    let nexaMonthlyData = getMonthlyData(nexaData.data, "Nexa");
    let commercialMonthlyData = getMonthlyData(Commercialdata.data, "Commercial");
    let arenaMonthlyData = getMonthlyData(ArenaData.data, "Arena");

    // Combine the monthly data into a single array
    let combinedMonthlyData = [];
    [autozoneMonthlyData, nexaMonthlyData, commercialMonthlyData, arenaMonthlyData].forEach((monthlyData) => {
      monthlyData.forEach((data) => {
        let monthData = combinedMonthlyData.find((m) => m.Month === data.Month);
        if (!monthData) {
          monthData = { Month: data.Month };
          combinedMonthlyData.push(monthData);
        }
        Object.assign(monthData, data);
      });
    });

    let autozoneMonthCounts = getCurrentAndPreviousMonthCounts(
      autozoneData.data
    );
    let nexaMonthCounts = getCurrentAndPreviousMonthCounts(nexaData.data);
    let commercialMonthCounts = getCurrentAndPreviousMonthCounts(
      Commercialdata.data
    );
    let arenaMonthCounts = getCurrentAndPreviousMonthCounts(ArenaData.data);

    let monthlyCounts = {
      AutozoneMonthlyData: autozoneMonthlyData,
      NexaMonthlyData: nexaMonthlyData,
      CommercialMonthlyData: commercialMonthlyData,
      ArenaMonthlyData: arenaMonthlyData,
    };

    let AllDataCount = {
      arenaCount: ArenaData.data.length,
      nexaCount: nexaData.data.length,
      commercialCount: Commercialdata.data.length,
      autozoneCount: autozoneData.data.length,
      AllDataCount:
        ArenaData.data.length +
        nexaData.data.length +
        Commercialdata.data.length +
        autozoneData.data.length,
      currentMonthCounts:
        autozoneMonthCounts.currentMonthCount +
        nexaMonthCounts.currentMonthCount +
        commercialMonthCounts.currentMonthCount +
        arenaMonthCounts.currentMonthCount,
      previousMonthCounts:
        autozoneMonthCounts.previousMonthCount +
        nexaMonthCounts.previousMonthCount +
        commercialMonthCounts.previousMonthCount +
        arenaMonthCounts.previousMonthCount,
    };

    let allLeads = [
      ArenaData.data,
      nexaData.data,
      Commercialdata.data,
      autozoneData.data,
    ];
    allLeads = allLeads.flat();

    allLeads.forEach((lead) => {
      if (lead.date && lead.time) {
        lead.timestamp = new Date(`${lead.date}T${lead.time}`);
      } //else {
    //     console.warn("Lead missing date or time:", lead);
    //   }
    });

    // Log the combined leads with timestamps
    // console.log("All Leads with timestamps:", allLeads);

    // Sort all leads by recency
    allLeads.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Get the most recent 20 leads
    let recentLeads = allLeads.slice(0, 20);

    res.status(200).send({
      status: true,
      Data: {
        LeadsCount: AllDataCount,
        monthlyCounts: monthlyCounts,
        recentLeads: recentLeads,
        barchart: combinedMonthlyData,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

module.exports = { getAllDataStaisticsPage };
