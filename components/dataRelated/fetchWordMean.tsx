import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!);

export type WordMean = {
  word: string;
  mean: string;
};

export async function fetchWordMean() {
  const data = await sql<WordMean[]>`
    SELECT *
    FROM table1`;
  console.log(data);
  return data;
}

export default async function WordMean(){
	const data = await fetchWordMean();
	return <div>{data[0].word}</div>;
}