import { Position, Uncertain } from '../types';

export default interface System {
  id: string;
  name: string;
  position: Position;
  /**
   * Population in billion
   */
  population: number | Uncertain<number>;
  populationTrend: 'rise' | 'fall';
  gdp: number | Uncertain<number>;
  gdpTrend: 'rise' | 'fall';
}
