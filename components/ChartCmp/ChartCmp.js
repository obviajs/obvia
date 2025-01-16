import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";

var ChartCmp = function (_props) {
  let _self = this;
  let _chart, _ctx, _chartData, _chartOptions, _chartType;

  Object.defineProperty(this, "chartData", {
    get: function () {
      return _chartData;
    },
    set: function (v) {
      if (_chartData !== v) {
        _chartData = v;
        if (_chart) {
          _chart.data = _chartData;
          _chart.update();
        }
      }
    },
    enumerable: true,
  });

  Object.defineProperty(this, "chartOptions", {
    get: function () {
      return _chartOptions;
    },
    set: function (v) {
      if (_chartOptions !== v) {
        _chartOptions = v;
        if (_chart) {
          _chart.options = _chartOptions;
          _chart.update();
        }
      }
    },
    enumerable: true,
  });

  Object.defineProperty(this, "guid", {
    get: function () {
      return this._guid;
    },
    set: function (value) {
      if (!this._guid) {
        this._guid = value;
      }
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(this, "chartType", {
    get: function () {
      return _chartType;
    },
    set: function (v) {
      if (_chartType !== v) {
        _chartType = v;
        if (_chart) {
          // Destroys previous chart instance if it exists
          _chart.destroy();
          _initChart();
        }
      }
    },
    enumerable: true,
  });

  this.template = function () {
    return `<canvas id="${this.domID}" style="height: ${_props.height}"></canvas>`;
  };

  this.endDraw = function (e) {
    if (e.target.id === this.domID) {
      // Delay the canvas initialization to allow DOM to fully render
      setTimeout(() => {
        const canvas = document.getElementById(this.domID);
        if (canvas) {
          _ctx = canvas.getContext("2d");
          _initChart();
        } else {
          console.warn("Canvas element not found for ID:", this.domID);
        }
      }, 0); // Delay to the next event loop
    }
  };

  const _initChart = function () {
    if (_ctx) {
      if (_chart) {
        _chart.destroy();
      }

      _chart = new Chart(_ctx, {
        type: _chartType,
        data: _chartData,
        options: _chartOptions,
      });
    }
  };

  let _defaultParams = {
    id: "chartComponent",
    chartData: {
      labels: _props.labels || [],
      datasets: [],
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            min: 6,
            max: 16,
          },
        },
      },
      legend: {
        display: false,
      },
    },
    chartType: _props.chartType,
  };

  ObjectUtils.fromDefault(_defaultParams, _props);

  _chartData = _props.chartData;
  _chartOptions = _props.chartOptions;
  _chartType = _props.chartType;

  let r = Container.call(this, _props, true);
  return r;
};

ChartCmp.prototype.ctor = "ChartCmp";

DependencyContainer.getInstance().register(
  "ChartCmp",
  ChartCmp,
  DependencyContainer.simpleResolve
);

export { ChartCmp };
