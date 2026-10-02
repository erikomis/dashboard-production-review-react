import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTheme, formatDayLong, formatDayShort, formatNote, niceTicks, tickInterval } from "@/modules/dashboard/utils/chart-data";
import { ChartTooltipBox } from "./ChartTooltip";

type DailyPoint = { date: string; count: number; averageNote?: number | null };

type TooltipPayload = readonly { payload?: DailyPoint }[];

const axisProps = (theme: ChartTheme) => ({
  tick: { fill: theme.axis, fontSize: 12 },
  tickLine: false,
  axisLine: { stroke: theme.grid },
});

type DailyBarChartProps = {
  data: DailyPoint[];
  theme: ChartTheme;
  /** Nome da série no tooltip ("Avaliações", "Novos usuários"). */
  seriesLabel: string;
  /** `<title>` e `<desc>` do SVG. */
  title: string;
  desc: string;
  height?: number;
  syncId?: string;
  color?: string;
};

/** Colunas de contagem por dia (barras finas, cantos arredondados só no topo). */
export const DailyBarChart = ({
  data,
  theme,
  seriesLabel,
  title,
  desc,
  height = 220,
  syncId,
  color,
}: DailyBarChartProps) => {
  const ticks = niceTicks(Math.max(0, ...data.map((d) => d.count)));
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} syncId={syncId} margin={{ top: 8, right: 8, bottom: 0, left: -16 }} title={title} desc={desc}>
          <CartesianGrid vertical={false} stroke={theme.grid} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDayShort}
            interval={tickInterval(data.length)}
            {...axisProps(theme)}
          />
          <YAxis allowDecimals={false} domain={[0, ticks[ticks.length - 1]]} ticks={ticks} width={44} {...axisProps(theme)} axisLine={false} />
          <Tooltip
            cursor={{ fill: theme.cursor }}
            content={({ active, payload }) => {
              const point = (payload as unknown as TooltipPayload | undefined)?.[0]?.payload;
              return (
                <ChartTooltipBox
                  active={active}
                  title={point ? formatDayLong(point.date) : undefined}
                  rows={point ? [{ label: seriesLabel, value: point.count, color: color ?? theme.primary }] : []}
                />
              );
            }}
          />
          <Bar
            dataKey="count"
            name={seriesLabel}
            fill={color ?? theme.primary}
            radius={[4, 4, 0, 0]}
            maxBarSize={24}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

type AverageLineChartProps = {
  data: DailyPoint[];
  theme: ChartTheme;
  title: string;
  desc: string;
  height?: number;
  syncId?: string;
};

/**
 * Nota média por dia, em escala fixa 1–5. Fica num gráfico separado (mesmo eixo X,
 * tooltips sincronizados) para não misturar duas escalas no mesmo eixo Y.
 */
export const AverageLineChart = ({ data, theme, title, desc, height = 150, syncId }: AverageLineChartProps) => (
  <div style={{ height }} className="w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} syncId={syncId} margin={{ top: 8, right: 8, bottom: 0, left: -16 }} title={title} desc={desc}>
        <CartesianGrid vertical={false} stroke={theme.grid} />
        <XAxis dataKey="date" tickFormatter={formatDayShort} interval={tickInterval(data.length)} {...axisProps(theme)} />
        <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} width={44} {...axisProps(theme)} axisLine={false} />
        <Tooltip
          cursor={{ stroke: theme.grid, strokeWidth: 1 }}
          content={({ active, payload }) => {
            const point = (payload as unknown as TooltipPayload | undefined)?.[0]?.payload;
            return (
              <ChartTooltipBox
                active={active}
                title={point ? formatDayLong(point.date) : undefined}
                rows={
                  point
                    ? [
                        {
                          label: "Nota média",
                          value: point.averageNote == null ? "sem avaliações" : formatNote(point.averageNote),
                          color: theme.star,
                        },
                      ]
                    : []
                }
              />
            );
          }}
        />
        <Line
          type="monotone"
          dataKey="averageNote"
          name="Nota média"
          stroke={theme.star}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          connectNulls
          dot={{ r: 4, fill: theme.star, stroke: theme.surface, strokeWidth: 2 }}
          activeDot={{ r: 5, fill: theme.star, stroke: theme.surface, strokeWidth: 2 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
