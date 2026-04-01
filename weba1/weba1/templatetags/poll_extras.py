from django import template
import json

try:
    from flexibilidade.utils import PendFlex
except Exception:
    PendFlex = None

register = template.Library()


@register.filter(name='update_bar')
def update_bar(value):
    if type(value) != str:
        return str(round(value, 2))


@register.filter(name='to_json')
def to_json(value):
    return json.dumps(value)


@register.filter(name='format')
def format(value):
    return value.replace(' ', '%')


@register.simple_tag(name='verify_tool', takes_context=True)
def verify_tool(context):
    return context.request.session['user_info']


@register.filter(name='limit_string')
def limit_string(value, limit=60):
    if type(value) is str:
        if len(value) > limit:
            value = value[:limit] + ' ...' 
    return value


@register.filter(name='color_by_status')
def color_by_status(value):
    if type(value) is str:
        if value == 'Em estudo':
            return 'violet'
        if value == 'OK, estudo concluído':
            return 'grey_blue'
        if value == 'Aguardando Tubulação (F0)':
            return 'yellow'
        if value == 'Liberado para cálculo (F1)':
            return 'orange'
        if value == 'Para revisão (F1)':
            return 'nude'
        if value == 'Em análise (F2)':
            return 'red'
        if value == 'Calculado (F3)':
            return 'green'
        if value == 'Tubulação ajustada (F4)':
            return 'blue'
    else:
        return ''


@register.filter(name='generate_id')
def generate_id(row, index):

    if (row is not None):
        if len(row) >= index:
            result = row[index]
            if type(result) == tuple:
                return result[1]
            else:
                return result
    return None


@register.filter(name='underline_off')
def underline_off(value):
    """
    Retira underlines das strings recebidas, além de deixar a primeira letra maiúscula
    """
    return value[0].upper() + value[1:].replace('_', ' ')


@register.filter(name='id_rev')
def id_rev(value):
    """
    Retira underlines das strings recebidas, além de deixar a primeira letra maiúscula
    """
    return f'{value[0]}_{int(value[-10])}'


@register.simple_tag(name='query')
def query(app, table, **kwargs):
    mod = __import__(f'{app}.models', fromlist=[table])
    table = getattr(mod, table)
    return table.objects.filter(**kwargs)


@register.filter(name='new_req')
def new_req(req):
    """
    Alternativa às requisições por AJAX, facilitando o back-end ao cadastrar novas requisições de flex
    @param:
        req: list
        Contém os valores: (id_sys_flex, isometrico, arquivo_pd2c, observacao, demanda, login)
    """
    if PendFlex is None:
        return None
    return PendFlex.request_flex_request(req)


@register.filter(name='new_req')
def new_req(req):
    """
    Alternativa às requisições por AJAX, facilitando o back-end ao cadastrar novas requisições de flex
    @param:
        req: list
        Contém os valores: (id_sys_flex, isometrico, arquivo_pd2c, observacao, demanda, login)
    """
    if PendFlex is None:
        return None
    return PendFlex.request_flex_request(req)


#@register.filter(name='verify_data')
#def verify_data(dados):
#    """
#    Verifica se o template em questão existe, antes de enviar a requisição por ajax
#    @param:
#        req: list
#        Contém os valores: (id_sys_flex, isometrico, arquivo_pd2c, observacao, demanda, login)
#    """
#    if get_campos(dados[0], dados[1]):
#        return 1
#    return 0
