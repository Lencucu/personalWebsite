import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!);

export type WordMean = {
  word: string;
  mean: string;
};

export async function fetchWordMean() {
  try{
    const data = await sql<WordMean[]>`
      SELECT *
      FROM table1`;
    console.log(data);
    return data;
  }catch(error){
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the WordMean.');
  }
}

export default async function WordMeanPage(){
	const data = await fetchWordMean();
	return <div>{data[0].word}</div>;
}