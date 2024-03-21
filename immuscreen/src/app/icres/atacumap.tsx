import { client } from "../../common/utils"
import React, {useMemo, useState} from "react"
import { useQuery } from "@apollo/client"
import { gql } from "@apollo/client"
import { Chart, linearTransform, Scatter } from "jubilant-carnival";

export function lower5(x: number): number {
    return Math.floor(x / 5) * 5;
  }
  
  export function upper5(x: number): number {
    return Math.ceil(x / 5) * 5;
  }
  export const range = (min: number, max: number, by: number = 1) => {
    let newVals: number[] = [];
    for (let i = min; i < max; i = i + by) {
      newVals.push(i);
    }
    return newVals;
  };
  
const ATAC_UMAP_QUERY = gql`
query atacUmapQuery($accession: String!) 
{
    calderonAtacUmapQuery(accession: $accession){
      name
      donor
      stimulation
      end
      celltype
      class
      umap_1
      umap_2
      value
      
    }
  }

`

export const ATACUMAP = (accession) => {
    const [tooltip, setTooltip] = useState(-1);
    const chartRef = React.useRef<SVGSVGElement>(null);
    const { loading: loading, data: data } = useQuery(ATAC_UMAP_QUERY, {
        variables: {
          accession: accession.accession
        },
        skip: !accession,
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
        client,
      })
      const maxValue = data && Math.max(...data.calderonAtacUmapQuery.map(a=>a.value))
      
    
      
      const gradient = data && linearTransform(
        { start: 0, end: maxValue },
        { start: 215, end: 0 }
      );
    const points = useMemo(
        () =>
          data && data.calderonAtacUmapQuery.map((x) => ({
            x: x.umap_1,
            y: x.umap_2,
            data: x.celltype,
            stimulation: x.stimulation,
            class: x.class,
            val: x.value,
            svgProps: {
              fill: `rgb(255,${gradient(
               x.value,
              ).toFixed(0)},0)`,
              fillOpacity:  0.6,
              r: 8,
              strokeWidth: x.stimulation==="S"  ? 4:0,
              stroke: "#000000",
              strokeOpacity: 0.4,
            },
          })),
        [data,loading]
      );
      //console.log(data, points)
      const domain = useMemo(
        () =>
          points && points.length > 0
            ? {
                x: {
                  start: lower5(Math.min(...points.map((x) => x.x)) * 1.1),
                  end: upper5(Math.max(...points.map((x) => x.x))),
                },
                y: {
                  start: lower5(Math.min(...points.map((x) => x.y)) * 1.1),
                  end: upper5(Math.max(...points.map((x) => x.y))),
                },
              }
            : { x: { start: 0, end: 1 }, y: { start: 0, end: 1 } },
        [points]
      );

    
    return (
        <>
        {points && maxValue && <Chart
        key={accession}
        marginFraction={0.28}
        innerSize={{ width: 2100, height: 2000 }}
        domain={domain}
        xAxisProps={{
          ticks: range(domain.x.start, domain.x.end + 1, 5),
          title: "UMAP-2",
        }}
        yAxisProps={{
          ticks: range(domain.y.start, domain.y.end + 1, 5),
          title: "UMAP-1",
        }}
        scatterData={[points]}
        ref={chartRef}
      >
        <Scatter
          data={points}
          onPointMouseOver={(i: number) => {
           setTooltip(i);
            //setHighlighted(points[i]?.data);
          }}
          onPointMouseOut={() => {
            setTooltip(-1);
           // setHighlighted("");
          }}
        />
        <defs>
                        <linearGradient id="scale" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stop-color="red" />
                          <stop offset="100%" stop-color="#ffcd00" />
                        </linearGradient>
                      </defs>
                      {tooltip > -1 && (
                        <rect
                          x={
                            points[tooltip].x - 2
                          }
                          y={points[tooltip].y}
                          width={
                            7
                            
                          }
                          height={1}
                          stroke="#000000"
                          strokeWidth={0.05}
                          fill="#ffffff"
                          fillOpacity={0.9}
                        />
                      )}
                      {tooltip > -1 && (
                        <text
                          x={points[tooltip].x+1.5}
                          y={points[tooltip].y-0.8}
                          fontSize={0.5}
                          textAnchor="middle"
                        >
                          {points[tooltip].class.replace(/_/g, " ")}
                        </text>
                      )}
                      <rect
                          x={upper5(Math.max(...points.map((x) => x.x))) + 2}
                          y={upper5(Math.max(...points.map((x) => x.y))) - 2}
                          width={0.5}
                          height={
                            upper5(Math.max(...points.map((x) => x.y))) -
                            lower5(Math.min(...points.map((x) => x.y))) -
                            5
                          }
                          fill="url(#scale)"
                        />
                        <text
                          x={upper5(Math.max(...points.map((x) => x.x))) + 1}
                          y={
                            (lower5(Math.min(...points.map((x) => x.y))) +
                              upper5(Math.max(...points.map((x) => x.y)))) /
                              2 +
                            0.5
                          }
                          transform="rotate(-90)"
                          fontSize={0.5}
                          textAnchor="middle"
                        >
                           Expression
                        </text>
                        <text
                          x={upper5(Math.max(...points.map((x) => x.x))) + 2}
                          y={lower5(Math.min(...points.map((x) => x.y)))+2.5}
                          fontSize={0.5}
                        >
                          0.0
                        </text>
                        <text
                          x={upper5(Math.max(...points.map((x) => x.x))) + 2}
                          y={upper5(Math.max(...points.map((x) => x.y)))-1.5}
                          fontSize={0.5}
                        >
                          {maxValue.toFixed(1)}
                        </text>

      </Chart>}
      </>
    )  
}