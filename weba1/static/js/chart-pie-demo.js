// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example
var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ["A - Automação", "RM - Mecânica", "C - Civil/Estrutura Metálica" , "E - Elétrica" , "I - Instrumentação" , "M - Tubulação","S - Suprimentos" , "G - Gerenciamento" , "P - Processo"],
    datasets: [{
      data: [12.21, 15.58, 5 , 11.25, 8.32, 3 , 7 , 10 , 8],
      backgroundColor: ['#f00', '#0f0', '#00f' ,'#ff0', '#28a745' ,'#0ff' , '#f0f' , '#faab05' , '#779ca3'],
    }],
  },
});
