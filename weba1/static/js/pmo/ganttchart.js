
function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

let GlobalChartList = [[]]
function drawChart(ChartList) {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Task ID');
      data.addColumn('string', 'Task Name');
      data.addColumn('string', 'Resource');
      data.addColumn('date', 'Start Date');
      data.addColumn('date', 'End Date');
      data.addColumn('number', 'Duration');
      data.addColumn('number', 'Percent Complete');
      data.addColumn('string', 'Dependencies');

      data.addRows(GlobalChartList);

      var options = {
            height: 3000,
            // width: 50,
            gantt: {
                trackHeight: 30,
            }

      };

      var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

      chart.draw(data, options);
}


async function RequestInfoGantt(){
    var process = []
    process = await $.ajax({
        url: "/app/pmo/DiagramaDeGanttWave/",
        method: "GET",
        data: { }
    });
    return process;
}


async function MontaGantt(){
    let InfoGantt = await RequestInfoGantt()
    GlobalChartList = []
    for(var i = 0; i <InfoGantt.length;i++){
        GlobalChartList.push([
            InfoGantt[i]['tb_pow_id'].toString(),
            InfoGantt[i]['tb_pow_name'].toString(),
            InfoGantt[i]['tb_pow_id_pow']+'',
            new Date(Date.parse(InfoGantt[i]['tb_pow_initial_date'])),
            new Date(Date.parse(InfoGantt[i]['tb_pow_final_date'])),
            null,
            null,
            null,
            ]
    )

    }
    google.charts.load('current', {'packages':['gantt']});
    google.charts.setOnLoadCallback(drawChart);

    //drawChart(list_ativ);

    /*
    data.addColumn('string', 'Task ID');
    data.addColumn('string', 'Task Name');
    data.addColumn('string', 'Resource');
    data.addColumn('date', 'Start Date');
    data.addColumn('date', 'End Date');
    data.addColumn('number', 'Duração');
    data.addColumn('number', 'Percentual Completo');
    data.addColumn('string', 'Dependencies');
    */



}
