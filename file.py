import csv

input_file = './src/photos.csv'  # Fișierul tău original
output_file = './src/photos_filtered.csv'  # Fișierul cu coloanele filtrate
columns_to_remove = [28, 29, 30, 31]  # Indicele coloanelor de eliminat (de exemplu, coloanele 4, 5, 10, 11)

with open(input_file, 'r') as infile:
    csvreader = csv.reader(infile, delimiter='\t')  # Citim fișierul tab-delimitat
    header = next(csvreader)  # Citim header-ul
    
    # Elimina coloanele din header
    header = [header[i] for i in range(len(header)) if i not in columns_to_remove]
    
    with open(output_file, 'w', newline='') as outfile:
        csvwriter = csv.writer(outfile, delimiter='\t')
        csvwriter.writerow(header)  # Scriem header-ul în fișierul de ieșire
        
        # Scriem liniile din fișierul original, eliminând coloanele specificate
        for row in csvreader:
            row = [row[i] for i in range(len(row)) if i not in columns_to_remove]
            csvwriter.writerow(row)

print(f'Fișierul a fost salvat cu succes la: {output_file}')
