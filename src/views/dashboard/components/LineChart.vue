<template>
  <div :class="className" :style="{ height, width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons");
import resize from "./mixins/resize";

export default {
  name: "LineChart",
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    className: {
      type: String,
    },
    chartData: {
      type: Object,
      required: true,
    },
    yTitle: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.chart = echarts.init(this.$el, "macarons");
    this.setOption(this.chartData);
  },
  methods: {
    setOption({ expectedData, actualData }) {
      // 指定图表的配置项和数据
      const option = {
        title: {},
        tooltip: {
          trigger: "axis", // 坐标轴触发
          axisPointer: {
            // 坐标轴指示器配置项
            type: "cross", //  十字准星指示器。表示启用两个正交的轴的 axisPointer
          },
        },

        grid: {
          left: 40,
          right: 40,
          bottom: 40,
          top: 40,
          containLabel: true,
        },

        legend: {
          data: ["预期", "实际"],
        },

        xAxis: {
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          boundaryGap: false,
        },

        yAxis: {
          name: this.yTitle,
        },

        series: [
          {
            name: "预期",
            type: "line",
            data: expectedData ? expectedData : [0, 0, 0, 0, 0, 0, 0],
            lineStyle: {
              color: "hotpink",
            },
            areaStyle: {
              color: "#ccc",
            },
            itemStyle: {
              color: "#FF005A",
            },
          },

          {
            name: "实际",
            type: "line",
            data: actualData ? actualData : [0, 0, 0, 0, 0, 0, 0],
            lineStyle: {
              color: "skyblue",
            },
            itemStyle: {
              color: "#3888fa",
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
  watch: {
    chartData: {
      deep: true,
      handler(newVal) {
        // console.log(newVal)
        this.setOption(newVal);
      },
    },
  },
};
</script>
