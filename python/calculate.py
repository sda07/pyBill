def calculate_it(total_dict):
	''' RETURN SUMMARY'''
	cal_sh = {'GROSS':0, 'TA':0, 'PTAX': 0, 'HRA' : 0, 'IT' : 0, 
	'CESS' : 0, '80C':0, '80CCD_1B':0, '80D':0, 'PAY': 0 }
	for key in list(total_dict.keys()):
		if key == 'BASIC':
			cal_sh['GROSS'] += int( total_dict[key] or 0)
			cal_sh['PAY'] += int(total_dict[key] or 0)
			

		elif key =='BASIC1':
			cal_sh['GROSS'] += int( total_dict[key] or 0)
			cal_sh['PAY'] += int(total_dict[key] or 0)

		elif key == 'SPLPAY':
			cal_sh['GROSS'] += int( total_dict[key] or 0)
		elif key == 'QPAY':
			cal_sh['GROSS'] += int( total_dict[key] or 0)
		elif key == 'TA':
			cal_sh['GROSS'] += int( total_dict[key] or 0)
			cal_sh['TA'] += int( total_dict[key] or 0)

		elif key == 'CCA':
			cal_sh['GROSS'] += int( total_dict[key] or 0)

		elif key == 'HRA':
			cal_sh['GROSS'] += int( total_dict[key] or 0)
			cal_sh['HRA'] += int(total_dict[key] or 0)

		elif key == 'DA':
			cal_sh['GROSS'] += int( total_dict[key] or 0)
			cal_sh['PAY'] += int(total_dict[key] or 0)

		elif key == 'WA':
			cal_sh['GROSS'] += int( total_dict[key] or 0)
			
		elif key == 'OTHER1':
			cal_sh['GROSS'] += int( total_dict[key] or 0)
			
		elif key == 'ROP':
			cal_sh['GROSS'] -= int( total_dict[key] or 0)
			
		elif key == 'SPLPAY':
			cal_sh['GROSS'] += int( total_dict[key] or 0)

		elif key == 'GRINSURANC':
			cal_sh['80C'] += int( total_dict[key] or 0)
		elif key == 'GPFT':
			cal_sh['80CCD_1B'] += int( total_dict[key] or 0)
		elif key == 'LIC':
			cal_sh['80C'] +=int(  total_dict[key ] or 0)
		elif key == 'PTAX':
			cal_sh['PTAX'] += int( total_dict[key] or 0)
		elif key == 'ITAX':
			cal_sh['IT'] += int( total_dict[key] or 0)
		elif key == 'SC':
			cal_sh['CESS'] += int( total_dict[key] or 0)
		elif key == 'CGHS':
			cal_sh['80D'] += int( total_dict[key] or 0)

	return cal_sh

	#print(cal_sh)
def rent_calculate(rent_paid, pay, hra):
	rent = int(rent_paid or 0) - int(round(pay*.1,0))
	if rent > hra:
		rent = hra
	elif rent < 0:
		rent = 0
	return rent

def savings(savings_dict, total_dict):
	sav = {}

	sav['s_80C'] = int( savings_dict['LIC_S'] or 0)
	sav['s_80C'] += int( savings_dict['PPF'] or 0) 
	sav['s_80C'] += int( savings_dict['HBL'] or 0)
	sav['s_80C'] += int( savings_dict['PLI'] or 0)
	sav['s_80C'] += int( savings_dict['NSC'] or 0)
	sav['s_80C'] += int( savings_dict['FD'] or 0)
	sav['s_80C'] += int( savings_dict['STAMP_DUTY'] or 0)
	sav['s_80C'] += int( savings_dict['ELSS'] or 0)
	sav['s_80C'] += int( savings_dict['TUTION'] or 0)
	sav['s_80C'] += int( savings_dict['OTHER_S'] or 0)

	sav['s_80D'] = int( savings_dict['MEDICLAIM'] or 0) 

	sav['s_80CCD'] = int( savings_dict['NPS_SELF'] or 0)

	sav['RENT'] = rent_calculate(savings_dict['RENT_PAI'], total_dict['PAY'],
		total_dict['HRA'])
	sav['s_24'] = savings_dict['hbi']

	return sav


def income_tax(total_dict, sav):
	''' calculate income tax'''
	net_tax = 0
	income_from_salary = int(total_dict['GROSS'] or 0)
	ta = int(total_dict['TA'] or 0)
	ptax = int(total_dict['PTAX'] or 0)
	tax_paid  = int(total_dict['IT'] or 0) #+  int (total_dict['CESS'] or 0)
	if (ta > 19200):
		ta = 19200
	rent = sav['RENT']
	hbi =int(sav['s_24'] or 0)

	if hbi > 200000:
		hbi = 200000

	savings_80CCD = int(total_dict['80CCD_1B'] or 0) + sav['s_80CCD']
	savings_80C = int(total_dict['80C'] or 0) + sav['s_80C']

	if savings_80CCD > 50000 :
		savings_80C  += savings_80CCD - 50000
		savings_80CCD = 50000
		
	if savings_80C > 150000:
		savings_80C = 150000

	savings_80D = int(total_dict['80D'] or 0) + sav['s_80D']
	taxable_income = income_from_salary - ta - rent - hbi - ptax
	total_income = taxable_income - (savings_80C + savings_80CCD + savings_80D)

	if total_income > 1000000:
		net_tax = 112500 + round((total_income - 1000000)*.3,0)
	elif total_income > 500000:
		net_tax = 12500 + round((total_income - 500000)*.2,0)
	elif total_income > 250000:
		net_tax = round((total_income - 250000)*.05,0)
		if total_income <= 350000:
			net_tax = net_tax - 2500
			if(net_tax < 0):
				net_tax = 0
	print ('-----------------------------')
	print ('-----------------------------')
	print ('income_from_salary - ', income_from_salary)
	print (' (-) PTAX            ', ptax)
	print (' (-) TA              ', ta)
	print (' (-) RENT            ', rent)
	print (' (-) HBI             ', hbi)
	print ('-----------------------------')
	print (' Taxable Income      ', taxable_income)
	print (' (-) 80C             ', savings_80C)
	print (' (-) 80D             ', savings_80D)
	print (' (-) savings_80CCD   ', savings_80CCD)
	print ('-----------------------------')
	print ('Total Income        ', total_income)
	print ('-----------------------------')
	print ('Income Tax           ', net_tax)
	print ('E. Cess              ', round(net_tax*.03,0))
	print ('-----------------------------')
	print ('Tax paid             ', tax_paid )
	return net_tax






