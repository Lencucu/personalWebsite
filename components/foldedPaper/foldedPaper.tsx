'use client'

import { gsap } from 'gsap';
import Link from 'next/link';

type FoldedPaperProps = {
  className?: string;
  画廊?: string;
  入口?: string;
};

export default function FoldedPaper(obj:FoldedPaperProps){
	let item:React.ReactNode[] = [], index = 0, classSetting='';
	Object.entries(obj).forEach(([key, value]) => {
		if(key!='className'){
			item[index] = <Link className={classSetting} key={key} href={value}>{key}</Link>;
			index ++;
		}
		else{
			classSetting = value;
		}
	});
	return item;
}