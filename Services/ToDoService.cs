using Microsoft.EntityFrameworkCore;
using System.Collections;
using ToDoList.Data;
using ToDoList.Interfaces;
using ToDoList.Models;

namespace ToDoList.Services
{
    public class ToDoService: IToDoService
    {
        private readonly DataContext _context;
        public ToDoService(DataContext dataContext)
        {
            _context = dataContext;
        }

        public async Task<IEnumerable<ToDo>> GetAllToDos()
        {
            return await _context.ToDos.ToListAsync();
        }

        public async Task<ToDo> GetToDoById(int id)
        {
            var result = await _context.ToDos.Where(x=> x.Id ==id).FirstOrDefaultAsync();
            return result ?? new ToDo();
        }

        public async Task<int> SaveToDo(ToDo toDo)
        {
            if (toDo?.Id != 0)
            {
               var toEdit = await _context.ToDos.FindAsync(toDo.Id);
                if (toEdit != null)
                {
                    toEdit.Name = toDo.Name;
                    toEdit.Description = toDo.Description;
                    toEdit.DueDate = toDo.DueDate;
                    return await _context.SaveChangesAsync();
                }
            }
            await _context.ToDos.AddAsync(toDo);
            var value = await _context.SaveChangesAsync();
            return value;
        }
    }
}
