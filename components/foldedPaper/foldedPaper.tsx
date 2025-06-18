'use client'

import { gsap } from 'gsap';
import Link from 'next/link';

export default function FoldedPaper(obj){
	let item = [], index = 0, classSetting='';
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