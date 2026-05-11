// GeoJSON → SVG path 변환 (빌드 시 한 번만 실행)
// 결과: data/korea-svg-paths.json
// 실행: node scripts/build-svg-paths.mjs

import { geoMercator, geoPath } from 'd3-geo';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const geo = JSON.parse(
  fs.readFileSync(path.join(root, 'data/korea-provinces.json'), 'utf8')
);

// SVG 좌표계 설정 (한반도 비율에 맞게 600x720)
const width = 600;
const height = 720;
const padding = 10;

const projection = geoMercator().fitExtent(
  [
    [padding, padding],
    [width - padding, height - padding],
  ],
  geo
);
const pathGen = geoPath(projection);

// 한글 시도명 → 우리 region code 매핑
const NAME_TO_CODE = {
  서울특별시: 'seoul',
  부산광역시: 'busan',
  대구광역시: 'daegu',
  인천광역시: 'incheon',
  광주광역시: 'gwangju',
  대전광역시: 'daejeon',
  울산광역시: 'ulsan',
  세종특별자치시: 'sejong',
  경기도: 'gyeonggi',
  강원도: 'gangwon',
  충청북도: 'chungbuk',
  충청남도: 'chungnam',
  전라북도: 'jeonbuk',
  전라남도: 'jeonnam',
  경상북도: 'gyeongbuk',
  경상남도: 'gyeongnam',
  제주특별자치도: 'jeju',
};

const paths = geo.features.map((f) => {
  const name = f.properties.name;
  const code = NAME_TO_CODE[name];
  const d = pathGen(f);
  const centroid = pathGen.centroid(f);
  return {
    code,
    name,
    d,
    centroid: [Math.round(centroid[0]), Math.round(centroid[1])],
  };
});

const output = { width, height, paths };

fs.writeFileSync(
  path.join(root, 'data/korea-svg-paths.json'),
  JSON.stringify(output, null, 2)
);

console.log(`✓ Generated ${paths.length} province paths`);
console.log(`  Output: data/korea-svg-paths.json`);
