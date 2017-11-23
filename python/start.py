#import openpyxl as op
def get_workbook_name():
	sheet_name = input("Enter workbook name \n(Workbook should be in same folder and .xlsx type):")
	return sheet_name
	
		

def validate_workbook_name(wb_name):
	''' validate name of the workbook if end with .xlsx
	keep unchanged else put a .xlsx in the end
	'''
	i = 0
	for counter in wb_name:
		if (counter == '.'):
			break
		else:
			i += 1
	if i==0:
		return '-1'
	elif i == len(wb_name):
		return wb_name + '.xlsx'
	else:
		wb_name = wb_name[:i]
		return wb_name + '.xlsx'

def check_file_existance(wb_name):
	''' Check whether the file exists in folder 
	return 0 if false 1 if true'''
	try:
		f = open(wb_name,'r')
		return 1
	except FileNotFoundError:
		return 0





if __name__ == "__main__":
	try:
		wb_name = get_workbook_name()
		wb_correct_name =validate_workbook_name(wb_name)
		print(check_file_existance(wb_correct_name))
	except NameError:
		pass

