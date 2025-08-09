export function DetalleMedidasTabla({ data }) {
  if (!data || data.length === 0) return null;

  const fecha = data[0].fecha; // asumimos misma fecha en el grupo
  const sortedData = [...data].sort((a, b) => b.num_tablas - a.num_tablas);

  return (
    <table>
      <thead>
        <tr>
          <th colSpan="4">{fecha}</th>
        </tr>
        <tr>
          <th>Ancho</th>
          <th>Grosor</th>
          <th>Número de tablas</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((item, index) => (
          <tr key={index}>
            <td>{item.ancho}</td>
            <td>{item.altura}</td>
            <td>{item.num_tablas}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
